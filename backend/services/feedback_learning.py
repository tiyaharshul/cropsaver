from database import (
    crop_history_collection,
    feedback_collection,
)


# ======================================================
# SETTINGS
# ======================================================

MIN_FEEDBACK_SAMPLES = 5


# ======================================================
# NORMALIZE TEXT
# ======================================================

def normalize_text(value: str) -> str:
    """
    Makes matching a little more reliable.

    Example:
    'Corn Earworm'
    ' corn earworm '
    'CORN EARWORM'

    all become:
    'corn earworm'
    """

    if not value:
        return ""

    return value.strip().lower()


# ======================================================
# GET MATCHING HISTORY IDS
# ======================================================

async def get_matching_history_ids(
    crop_name: str,
    problem_name: str,
):

    crop_normalized = normalize_text(
        crop_name
    )

    problem_normalized = normalize_text(
        problem_name
    )


    if (
        not crop_normalized
        or not problem_normalized
    ):
        return []


    # --------------------------------------------------
    # We scan previous history records.
    #
    # This supports both:
    #
    # old records:
    # disease_name
    #
    # new records:
    # problem_name
    # --------------------------------------------------

    cursor = crop_history_collection.find(
        {},
        {
            "_id": 1,
            "crop_name": 1,
            "disease_name": 1,
            "problem_name": 1,
        },
    )


    matching_ids = []


    async for history in cursor:

        history_crop = normalize_text(
            history.get(
                "crop_name",
                "",
            )
        )


        history_problem = normalize_text(
            history.get(
                "problem_name"
            )
            or history.get(
                "disease_name",
                "",
            )
        )


        if (
            history_crop == crop_normalized
            and
            history_problem == problem_normalized
        ):

            matching_ids.append(
                str(history["_id"])
            )


    return matching_ids


# ======================================================
# GET FEEDBACK INSIGHTS
# ======================================================

async def get_feedback_insights(
    crop_name: str,
    problem_name: str,
):

    """
    Finds feedback from previous diagnoses
    involving the same crop + crop problem.

    Returns aggregated farmer outcome data.

    Farmer feedback is NOT considered reliable
    enough to influence Gemini until at least
    MIN_FEEDBACK_SAMPLES records exist.
    """


    # --------------------------------------------------
    # STEP 1
    # Find matching diagnosis records
    # --------------------------------------------------

    history_ids = (
        await get_matching_history_ids(
            crop_name=crop_name,
            problem_name=problem_name,
        )
    )


    if not history_ids:

        return None


    # --------------------------------------------------
    # STEP 2
    # Find feedback belonging to those diagnoses
    # --------------------------------------------------

    cursor = feedback_collection.find(
        {
            "crop_history_id": {
                "$in": history_ids
            }
        }
    )


    total = 0

    worked_count = 0

    rating_total = 0.0
    rating_count = 0

    recovery_total = 0.0
    recovery_count = 0


    async for feedback in cursor:

        total += 1


        # ----------------------------------------------
        # Treatment worked
        # ----------------------------------------------

        if (
            feedback.get(
                "treatment_worked"
            )
            is True
        ):

            worked_count += 1


        # ----------------------------------------------
        # Rating
        # ----------------------------------------------

        rating = feedback.get(
            "rating"
        )


        if isinstance(
            rating,
            (int, float),
        ):

            if 1 <= rating <= 5:

                rating_total += rating

                rating_count += 1


        # ----------------------------------------------
        # Recovery days
        # ----------------------------------------------

        recovery_days = feedback.get(
            "recovery_days"
        )


        if isinstance(
            recovery_days,
            (int, float),
        ):

            if (
                0 <=
                recovery_days <=
                365
            ):

                recovery_total += (
                    recovery_days
                )

                recovery_count += 1


    # --------------------------------------------------
    # STEP 3
    # Minimum sample protection
    # --------------------------------------------------

    if total < MIN_FEEDBACK_SAMPLES:

        print(
            "Feedback learning skipped:",
            crop_name,
            problem_name,
            f"only {total} feedback records",
        )

        return None


    # --------------------------------------------------
    # STEP 4
    # Calculate statistics
    # --------------------------------------------------

    success_rate = round(
        (
            worked_count /
            total
        ) * 100,
        1,
    )


    average_rating = None


    if rating_count > 0:

        average_rating = round(
            rating_total /
            rating_count,
            1,
        )


    average_recovery_days = None


    if recovery_count > 0:

        average_recovery_days = round(
            recovery_total /
            recovery_count,
            1,
        )


    # --------------------------------------------------
    # STEP 5
    # Return insights
    # --------------------------------------------------

    return {

        "sample_size":
            total,

        "worked_count":
            worked_count,

        "success_rate":
            success_rate,

        "average_rating":
            average_rating,

        "average_recovery_days":
            average_recovery_days,

    }


# ======================================================
# BUILD GEMINI CONTEXT
# ======================================================

def build_feedback_context(
    insights,
):

    """
    Converts MongoDB statistics into safe
    supplementary context for Gemini.
    """


    if not insights:

        return """
FARMER FEEDBACK DATA:

There is not yet enough reliable farmer feedback
for this exact crop and crop problem.

Do not infer treatment effectiveness from farmer
feedback.
"""


    sample_size = insights.get(
        "sample_size"
    )


    success_rate = insights.get(
        "success_rate"
    )


    average_rating = insights.get(
        "average_rating"
    )


    average_recovery = insights.get(
        "average_recovery_days"
    )


    rating_text = (
        f"{average_rating}/5"
        if average_rating is not None
        else "Not enough rating data"
    )


    recovery_text = (
        f"{average_recovery} days"
        if average_recovery is not None
        else "Not enough recovery data"
    )


    return f"""
FARMER FEEDBACK DATA:

The application has collected farmer-reported
outcomes from previous cases involving the same
crop and crop problem.

Number of feedback records:
{sample_size}

Farmers reporting that treatment helped:
{success_rate}%

Average farmer rating:
{rating_text}

Average farmer-reported recovery:
{recovery_text}

IMPORTANT:

This information is observational farmer feedback.

It is NOT controlled scientific evidence.

Use it only as supplementary context when generating
the recommendation.

Do not recommend a pesticide, chemical, dosage,
spray interval, or unsafe agricultural practice
merely because farmer feedback was positive.

Established agricultural guidance, registered
product labels, diagnosis confidence, and safety
must take priority over farmer feedback.
"""