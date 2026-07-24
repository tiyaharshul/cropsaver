import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

import '../styles/cropCalendar.css'


// ======================================================
// OPTIONS
// ======================================================

const CROPS = [
  'Maize',
  'Wheat',
  'Rice',
  'Tomato',
  'Potato',
  'Soybean',
  'Groundnut',
  'Mustard',
  'Cotton',
  'Sugarcane',
  'Onion',
  'Chilli',
  'Bajra',
  'Barley',
  'Gram',
]

const SEASONS = [
  'Kharif',
  'Rabi',
  'Zaid',
  'Year Round',
]


// ======================================================
// LANGUAGE -> DATE LOCALE
// ======================================================

const DATE_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  raj: 'hi-IN',
  bho: 'hi-IN',
  har: 'hi-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  or: 'or-IN',
  as: 'as-IN',
}


// ======================================================
// PAGE
// ======================================================

export default function CropCalendar() {

  const {
    t,
    language,
  } = useLanguage()


  // ====================================================
  // USER
  // ====================================================

  const user = useMemo(
    () => {
      try {
        return JSON.parse(
          localStorage.getItem(
            'cropsaver_user'
          ) || 'null'
        )
      } catch {
        return null
      }
    },
    []
  )


  const userId =
    user?.id ||
    user?._id ||
    localStorage.getItem(
      'user_name'
    ) ||
    'anonymous'


  // ====================================================
  // FORM STATE
  // ====================================================

  const [
    cropName,
    setCropName,
  ] = useState('Maize')


  const [
    season,
    setSeason,
  ] = useState('Kharif')


  const [
    sowingDate,
    setSowingDate,
  ] = useState('')


  const [
    state,
    setState,
  ] = useState(
    user?.state || ''
  )


  // ====================================================
  // PAGE STATE
  // ====================================================

  const [
    calendars,
    setCalendars,
  ] = useState([])


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    creating,
    setCreating,
  ] = useState(false)


  const [
    updatingTask,
    setUpdatingTask,
  ] = useState(null)


  const [
    deletingId,
    setDeletingId,
  ] = useState(null)


  const [
    error,
    setError,
  ] = useState('')


  const [
    message,
    setMessage,
  ] = useState('')


  // ====================================================
  // LOAD CALENDARS
  // ====================================================

  const loadCalendars = async () => {

    try {

      setLoading(true)
      setError('')


      const response =
        await api.get(
          '/calendar',
          {
            params: {
              user_id: userId,
            },
          }
        )


      setCalendars(
        response.data.calendars || []
      )

    } catch (err) {

      console.error(
        'Calendar load error:',
        err
      )


      setError(
        err.response?.data?.detail ||
        t?.calendarLoadError ||
        'Could not load your crop calendars.'
      )

    } finally {

      setLoading(false)

    }

  }


  useEffect(
    () => {

      loadCalendars()

    },
    [userId]
  )


  // ====================================================
  // CREATE CALENDAR
  // ====================================================

  const createCalendar =
    async (event) => {

      event.preventDefault()

      setError('')
      setMessage('')


      if (!cropName) {

        setError(
          t?.calendarSelectCrop ||
          'Please select a crop.'
        )

        return

      }


      if (!state.trim()) {

        setError(
          t?.calendarEnterState ||
          'Please enter your state.'
        )

        return

      }


      if (!season) {

        setError(
          t?.calendarSelectSeason ||
          'Please select a season.'
        )

        return

      }


      if (!sowingDate) {

        setError(
          t?.calendarSelectSowingDate ||
          'Please select the sowing date.'
        )

        return

      }


      try {

        setCreating(true)


        const response =
          await api.post(
            '/calendar',
            {
              user_id: userId,
              crop_name: cropName,
              state: state.trim(),
              season: season,
              sowing_date: sowingDate,
            }
          )


        const newCalendar =
          response.data.calendar


        setCalendars(
          (current) => [
            newCalendar,
            ...current,
          ]
        )


        setMessage(
          t?.calendarCreatedSuccess ||
          'Crop calendar created successfully.'
        )


        setSowingDate('')

      } catch (err) {

        console.error(
          'Create calendar error:',
          err
        )


        setError(
          err.response?.data?.detail ||
          t?.calendarCreateError ||
          'Could not create crop calendar.'
        )

      } finally {

        setCreating(false)

      }

    }


  // ====================================================
  // UPDATE TASK
  // ====================================================

  const toggleTask =
    async (
      calendarId,
      task
    ) => {

      const updateKey =
        `${calendarId}-${task.task_id}`


      try {

        setUpdatingTask(
          updateKey
        )

        setError('')


        const response =
          await api.patch(
            `/calendar/${calendarId}/tasks/${task.task_id}`,
            {
              completed:
                !task.completed,
            },
            {
              params: {
                user_id: userId,
              },
            }
          )


        const updatedCalendar =
          response.data.calendar


        setCalendars(
          (current) =>
            current.map(
              (calendar) =>
                calendar._id === calendarId
                  ? updatedCalendar
                  : calendar
            )
        )

      } catch (err) {

        console.error(
          'Update task error:',
          err
        )


        setError(
          err.response?.data?.detail ||
          t?.calendarUpdateError ||
          'Could not update this task.'
        )

      } finally {

        setUpdatingTask(null)

      }

    }


  // ====================================================
  // DELETE CALENDAR
  // ====================================================

  const deleteCalendar =
    async (calendarId) => {

      const confirmed =
        window.confirm(
          t?.calendarDeleteConfirm ||
          'Delete this crop calendar? This action cannot be undone.'
        )


      if (!confirmed) {
        return
      }


      try {

        setDeletingId(
          calendarId
        )

        setError('')
        setMessage('')


        await api.delete(
          `/calendar/${calendarId}`,
          {
            params: {
              user_id: userId,
            },
          }
        )


        setCalendars(
          (current) =>
            current.filter(
              (calendar) =>
                calendar._id !== calendarId
            )
        )


        setMessage(
          t?.calendarDeletedSuccess ||
          'Crop calendar deleted.'
        )

      } catch (err) {

        console.error(
          'Delete calendar error:',
          err
        )


        setError(
          err.response?.data?.detail ||
          t?.calendarDeleteError ||
          'Could not delete crop calendar.'
        )

      } finally {

        setDeletingId(null)

      }

    }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="crop-calendar-page">


      {/* ================= PAGE HEADER ================= */}

      <section className="calendar-page-header">

        <span className="calendar-eyebrow">
          🌾 {t?.calendarPlanning || 'Crop Planning'}
        </span>


        <h1>
          {t?.cropCalendarTitle || 'Crop Calendar'}
        </h1>


        <p>
          {t?.cropCalendarDescription ||
            'Plan your crop journey from sowing to harvest and keep track of important farming activities.'}
        </p>

      </section>


      {/* ================= ALERTS ================= */}

      {error && (

        <div className="calendar-alert error">
          {error}
        </div>

      )}


      {message && (

        <div className="calendar-alert success">
          ✓ {message}
        </div>

      )}


      <div className="calendar-layout">


        {/* ================= CREATE CALENDAR ================= */}

        <aside className="calendar-create-card">

          <div className="calendar-card-heading">

            <span className="calendar-small-label">
              {t?.calendarNewCrop || 'New Crop'}
            </span>


            <h2>
              {t?.calendarCreateTitle ||
                'Create Crop Calendar'}
            </h2>


            <p>
              {t?.calendarCreateDescription ||
                'Add your crop and sowing information to generate a farming timeline.'}
            </p>

          </div>


          <form
            onSubmit={createCalendar}
            className="calendar-form"
          >

            {/* CROP */}

            <label>

              <span>
                {t?.calendarCrop || 'Crop'}
              </span>


              <select
                value={cropName}
                onChange={
                  (event) =>
                    setCropName(
                      event.target.value
                    )
                }
              >

                {CROPS.map(
                  (crop) => (

                    <option
                      key={crop}
                      value={crop}
                    >
                      {getCropLabel(crop, t)}
                    </option>

                  )
                )}

              </select>

            </label>


            {/* STATE */}

            <label>

              <span>
                {t?.calendarState || 'State'}
              </span>


              <input
                type="text"
                value={state}
                onChange={
                  (event) =>
                    setState(
                      event.target.value
                    )
                }
                placeholder="Rajasthan"
              />

            </label>


            {/* SEASON */}

            <label>

              <span>
                {t?.calendarSeason || 'Season'}
              </span>


              <select
                value={season}
                onChange={
                  (event) =>
                    setSeason(
                      event.target.value
                    )
                }
              >

                {SEASONS.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {getSeasonLabel(item, t)}
                    </option>

                  )
                )}

              </select>

            </label>


            {/* SOWING DATE */}

            <label>

              <span>
                {t?.calendarSowingDate ||
                  'Sowing Date'}
              </span>


              <input
                type="date"
                value={sowingDate}
                onChange={
                  (event) =>
                    setSowingDate(
                      event.target.value
                    )
                }
              />

            </label>


            <button
              type="submit"
              disabled={creating}
              className="calendar-create-button"
            >

              {creating
                ? (
                  t?.calendarCreating ||
                  'Creating Calendar...'
                )
                : (
                  `＋ ${
                    t?.calendarCreateButton ||
                    'Create Calendar'
                  }`
                )}

            </button>

          </form>

        </aside>


        {/* ================= CALENDARS ================= */}

        <section className="calendar-content">


          {loading && (

            <div className="calendar-empty">

              <div>
                🌱
              </div>

              <h3>
                {t?.calendarLoading ||
                  'Loading your calendars...'}
              </h3>

            </div>

          )}


          {!loading &&
            calendars.length === 0 && (

              <div className="calendar-empty">

                <div className="calendar-empty-icon">
                  📅
                </div>


                <h2>
                  {t?.calendarNoCalendars ||
                    'No crop calendars yet'}
                </h2>


                <p>
                  {t?.calendarNoCalendarsDescription ||
                    'Create your first crop calendar to start tracking farming activities.'}
                </p>

              </div>

            )}


          {!loading &&
            calendars.map(
              (calendar) => (

                <CalendarCard
                  key={calendar._id}
                  calendar={calendar}
                  updatingTask={
                    updatingTask
                  }
                  deleting={
                    deletingId ===
                    calendar._id
                  }
                  onToggleTask={
                    toggleTask
                  }
                  onDelete={
                    deleteCalendar
                  }
                  t={t}
                  language={language}
                />

              )
            )}

        </section>

      </div>

    </div>
  )
}


// ======================================================
// CALENDAR CARD
// ======================================================

function CalendarCard({
  calendar,
  updatingTask,
  deleting,
  onToggleTask,
  onDelete,
  t,
  language,
}) {

  const tasks =
    calendar.tasks || []


  const completed =
    tasks.filter(
      (task) =>
        task.completed
    ).length


  const percentage =
    tasks.length > 0
      ? Math.round(
          (
            completed /
            tasks.length
          ) * 100
        )
      : 0


  return (

    <article className="crop-calendar-card">


      {/* ================= CARD HEADER ================= */}

      <div className="crop-calendar-card-header">

        <div>

          <span className="calendar-small-label">
            {t?.calendarActiveCrop ||
              'Active Crop'}
          </span>


          <h2>

            {getCropEmoji(
              calendar.crop_name
            )}

            {' '}

            {getCropLabel(
              calendar.crop_name,
              t
            )}

          </h2>


          <p>

            {getSeasonLabel(
              calendar.season,
              t
            )}

            {' • '}

            {calendar.state}

          </p>

        </div>


        <button
          type="button"
          disabled={deleting}
          onClick={
            () =>
              onDelete(
                calendar._id
              )
          }
          className="calendar-delete-button"
        >

          {deleting
            ? (
              t?.calendarDeleting ||
              'Deleting...'
            )
            : (
              `🗑 ${
                t?.calendarDelete ||
                'Delete'
              }`
            )}

        </button>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="calendar-summary-grid">

        <SummaryItem
          label={
            t?.calendarSowing ||
            'Sowing'
          }
          value={
            formatDate(
              calendar.sowing_date,
              language
            )
          }
        />


        <SummaryItem
          label={
            t?.calendarExpectedHarvest ||
            'Expected Harvest'
          }
          value={
            formatDate(
              calendar.expected_harvest_date,
              language
            )
          }
        />


        <SummaryItem
          label={
            t?.calendarProgress ||
            'Progress'
          }
          value={`${percentage}%`}
        />

      </div>


      {/* ================= PROGRESS ================= */}

      <div className="calendar-progress">

        <div className="calendar-progress-info">

          <span>
            {t?.calendarFarmingActivities ||
              'Farming activities'}
          </span>

          <strong>
            {completed}/{tasks.length}
          </strong>

        </div>


        <div className="calendar-progress-track">

          <div
            className="calendar-progress-fill"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>


      {/* ================= TASK TIMELINE ================= */}

      <div className="calendar-timeline">

        {tasks.map(
          (task) => {

            const status =
              getTaskStatus(task)


            const updateKey =
              `${calendar._id}-${task.task_id}`


            const updating =
              updatingTask === updateKey


            return (

              <div
                key={task.task_id}
                className={`
                  calendar-task
                  ${status}
                  ${
                    task.completed
                      ? 'completed'
                      : ''
                  }
                `}
              >

                <button
                  type="button"
                  disabled={updating}
                  onClick={
                    () =>
                      onToggleTask(
                        calendar._id,
                        task
                      )
                  }
                  className="calendar-task-check"
                >

                  {updating
                    ? '…'
                    : task.completed
                      ? '✓'
                      : ''}

                </button>


                <div className="calendar-task-body">

                  <div className="calendar-task-top">

                    <div>

                      <span className="calendar-task-icon">

                        {getTaskIcon(
                          task.task_type
                        )}

                      </span>


                      <strong>
                        {getTaskTitle(
                          task,
                          t
                        )}
                      </strong>

                    </div>


                    <StatusBadge
                      status={status}
                      t={t}
                    />

                  </div>


                  <p className="calendar-task-date">

                    {formatDate(
                      task.scheduled_date,
                      language
                    )}

                  </p>


                  {task.description && (

                    <p className="calendar-task-description">

                      {getTaskDescription(
                        task,
                        t
                      )}

                    </p>

                  )}

                </div>

              </div>

            )

          }
        )}

      </div>

    </article>
  )
}


// ======================================================
// SUMMARY
// ======================================================

function SummaryItem({
  label,
  value,
}) {

  return (

    <div className="calendar-summary-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  )
}


// ======================================================
// STATUS
// ======================================================

function StatusBadge({
  status,
  t,
}) {

  const labels = {

    completed:
      t?.calendarCompleted ||
      'Completed',

    today:
      t?.calendarToday ||
      'Today',

    overdue:
      t?.calendarOverdue ||
      'Overdue',

    upcoming:
      t?.calendarUpcoming ||
      'Upcoming',

  }


  return (

    <span
      className={`
        calendar-status
        ${status}
      `}
    >
      {labels[status]}
    </span>

  )
}


// ======================================================
// TASK TRANSLATION
// ======================================================

function getTaskTitle(
  task,
  t
) {

  const value =
    (
      task.task_type ||
      task.title ||
      ''
    )
      .toLowerCase()
      .trim()


  if (
    value.includes('sowing')
  ) {
    return (
      t?.calendarTaskSowing ||
      task.title
    )
  }


  if (
    value.includes('germination')
  ) {
    return (
      t?.calendarTaskGermination ||
      task.title
    )
  }


  if (
    value.includes('weed')
  ) {
    return (
      t?.calendarTaskWeeding ||
      task.title
    )
  }


  if (
    value.includes('fertilizer') ||
    value.includes('fertiliser')
  ) {
    return (
      t?.calendarTaskFertilizer ||
      task.title
    )
  }


  if (
    value.includes('pest')
  ) {
    return (
      t?.calendarTaskPest ||
      task.title
    )
  }


  if (
    value.includes('disease')
  ) {
    return (
      t?.calendarTaskDisease ||
      task.title
    )
  }


  if (
    value.includes('growth')
  ) {
    return (
      t?.calendarTaskGrowth ||
      task.title
    )
  }


  if (
    value.includes('harvest')
  ) {

    if (
      value.includes('preparation')
    ) {
      return (
        t?.calendarTaskHarvestPreparation ||
        task.title
      )
    }

    return (
      t?.calendarTaskExpectedHarvest ||
      task.title
    )

  }


  if (
    value.includes('irrigation')
  ) {

    if (
      task.title
        ?.toLowerCase()
        .includes('mid')
    ) {

      return (
        t?.calendarTaskMidIrrigation ||
        task.title
      )

    }

    return (
      t?.calendarTaskIrrigation ||
      task.title
    )

  }


  return task.title
}


// ======================================================
// TASK DESCRIPTION TRANSLATION
// ======================================================

function getTaskDescription(
  task,
  t
) {

  const title =
    (
      task.title ||
      task.task_type ||
      ''
    )
      .toLowerCase()
      .trim()


  if (
    title.includes('sowing')
  ) {
    return (
      t?.calendarTaskSowingDesc ||
      task.description
    )
  }


  if (
    title.includes('germination')
  ) {
    return (
      t?.calendarTaskGerminationDesc ||
      task.description
    )
  }


  if (
    title.includes('weed')
  ) {
    return (
      t?.calendarTaskWeedingDesc ||
      task.description
    )
  }


  if (
    title.includes('fertilizer') ||
    title.includes('fertiliser')
  ) {
    return (
      t?.calendarTaskFertilizerDesc ||
      task.description
    )
  }


  if (
    title.includes('pest')
  ) {
    return (
      t?.calendarTaskPestDesc ||
      task.description
    )
  }


  if (
    title.includes('disease')
  ) {
    return (
      t?.calendarTaskDiseaseDesc ||
      task.description
    )
  }


  if (
    title.includes('growth')
  ) {
    return (
      t?.calendarTaskGrowthDesc ||
      task.description
    )
  }


  if (
    title.includes('harvest')
  ) {

    if (
      title.includes('preparation')
    ) {

      return (
        t?.calendarTaskHarvestPreparationDesc ||
        task.description
      )

    }

    return (
      t?.calendarTaskExpectedHarvestDesc ||
      task.description
    )

  }


  if (
    title.includes('irrigation')
  ) {

    if (
      title.includes('mid')
    ) {

      return (
        t?.calendarTaskMidIrrigationDesc ||
        task.description
      )

    }

    return (
      t?.calendarTaskIrrigationDesc ||
      task.description
    )

  }


  return task.description
}


// ======================================================
// CROP TRANSLATION
// ======================================================

function getCropLabel(
  crop,
  t
) {

  const key =
    crop
      ?.trim()
      ?.toLowerCase()


  const labels = {

    maize:
      t?.calendarCropMaize,

    wheat:
      t?.calendarCropWheat,

    rice:
      t?.calendarCropRice,

    tomato:
      t?.calendarCropTomato,

    potato:
      t?.calendarCropPotato,

    soybean:
      t?.calendarCropSoybean,

    groundnut:
      t?.calendarCropGroundnut,

    mustard:
      t?.calendarCropMustard,

    cotton:
      t?.calendarCropCotton,

    sugarcane:
      t?.calendarCropSugarcane,

    onion:
      t?.calendarCropOnion,

    chilli:
      t?.calendarCropChilli,

    bajra:
      t?.calendarCropBajra,

    barley:
      t?.calendarCropBarley,

    gram:
      t?.calendarCropGram,

  }


  return (
    labels[key] ||
    crop
  )
}


// ======================================================
// SEASON TRANSLATION
// ======================================================

function getSeasonLabel(
  season,
  t
) {

  const key =
    season
      ?.trim()
      ?.toLowerCase()


  const labels = {

    kharif:
      t?.calendarSeasonKharif,

    rabi:
      t?.calendarSeasonRabi,

    zaid:
      t?.calendarSeasonZaid,

    'year round':
      t?.calendarSeasonYearRound,

  }


  return (
    labels[key] ||
    season
  )
}


// ======================================================
// DATE PARSING
// ======================================================

function parseCalendarDate(
  value
) {

  if (!value) {
    return null
  }


  if (
    typeof value === 'string'
  ) {

    if (
      value.includes('T')
    ) {

      const parsed =
        new Date(value)


      return Number.isNaN(
        parsed.getTime()
      )
        ? null
        : parsed

    }


    const parsed =
      new Date(
        `${value}T00:00:00`
      )


    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed

  }


  const parsed =
    new Date(value)


  return Number.isNaN(
    parsed.getTime()
  )
    ? null
    : parsed
}


// ======================================================
// TASK STATUS
// ======================================================

function getTaskStatus(
  task
) {

  if (task.completed) {
    return 'completed'
  }


  const today =
    new Date()


  today.setHours(
    0,
    0,
    0,
    0
  )


  const taskDate =
    parseCalendarDate(
      task.scheduled_date
    )


  if (!taskDate) {
    return 'upcoming'
  }


  taskDate.setHours(
    0,
    0,
    0,
    0
  )


  if (
    taskDate.getTime() ===
    today.getTime()
  ) {
    return 'today'
  }


  if (
    taskDate < today
  ) {
    return 'overdue'
  }


  return 'upcoming'
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(
  value,
  language = 'en'
) {

  const date =
    parseCalendarDate(value)


  if (!date) {
    return '—'
  }


  const locale =
    DATE_LOCALES[language] ||
    'en-IN'


  try {

    return date.toLocaleDateString(
      locale,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )

  } catch {

    return date.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )

  }
}


// ======================================================
// TASK ICON
// ======================================================

function getTaskIcon(
  type
) {

  const icons = {
    sowing: '🌱',
    irrigation: '💧',
    inspection: '🔍',
    weeding: '🌿',
    fertilizer: '🧪',
    pest: '🐛',
    disease: '🩺',
    growth: '🌾',
    harvest: '🧺',
  }


  return (
    icons[type] ||
    '📌'
  )
}


// ======================================================
// CROP ICON
// ======================================================

function getCropEmoji(
  crop
) {

  const value =
    crop
      ?.trim()
      ?.toLowerCase()


  const icons = {
    maize: '🌽',
    wheat: '🌾',
    rice: '🌾',
    tomato: '🍅',
    potato: '🥔',
    soybean: '🌱',
    groundnut: '🥜',
    mustard: '🌼',
    cotton: '☁️',
    sugarcane: '🎋',
    onion: '🧅',
    chilli: '🌶️',
    bajra: '🌾',
    barley: '🌾',
    gram: '🌱',
  }


  return (
    icons[value] ||
    '🌱'
  )
}