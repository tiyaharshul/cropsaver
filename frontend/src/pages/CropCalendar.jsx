import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import api from '../api/axios'

import {
  useLanguage,
} from '../contexts/LanguageContext'

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
// PAGE
// ======================================================

export default function CropCalendar() {

  const { t } = useLanguage()


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
          'Please select a crop.'
        )

        return

      }


      if (!state.trim()) {

        setError(
          'Please enter your state.'
        )

        return

      }


      if (!season) {

        setError(
          'Please select a season.'
        )

        return

      }


      if (!sowingDate) {

        setError(
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
          `${cropName} crop calendar created successfully.`
        )


        setSowingDate('')

      } catch (err) {

        console.error(
          'Create calendar error:',
          err
        )


        setError(
          err.response?.data?.detail ||
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
          'Crop calendar deleted.'
        )

      } catch (err) {

        console.error(
          'Delete calendar error:',
          err
        )


        setError(
          err.response?.data?.detail ||
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


      <section className="calendar-page-header">

        <span className="calendar-eyebrow">
          🌾 CROP PLANNING
        </span>


        <h1>
          {t?.cropCalendar ||
            'Crop Calendar'}
        </h1>


        <p>
          Plan your crop journey from
          sowing to harvest and keep track
          of important farming activities.
        </p>

      </section>


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


        {/* CREATE CALENDAR */}

        <aside className="calendar-create-card">

          <div className="calendar-card-heading">

            <span className="calendar-small-label">
              NEW CROP
            </span>


            <h2>
              Create Crop Calendar
            </h2>


            <p>
              Add your crop and sowing
              information to generate a
              farming timeline.
            </p>

          </div>


          <form
            onSubmit={createCalendar}
            className="calendar-form"
          >

            <label>

              <span>
                Crop
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
                      {crop}
                    </option>

                  )
                )}

              </select>

            </label>


            <label>

              <span>
                State
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


            <label>

              <span>
                Season
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
                      {item}
                    </option>

                  )
                )}

              </select>

            </label>


            <label>

              <span>
                Sowing Date
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
                ? 'Creating Calendar...'
                : '＋ Create Calendar'}

            </button>

          </form>

        </aside>


        {/* CALENDARS */}

        <section className="calendar-content">


          {loading && (

            <div className="calendar-empty">

              <div>
                🌱
              </div>

              <h3>
                Loading your calendars...
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
                  No crop calendars yet
                </h2>


                <p>
                  Create your first crop
                  calendar to start tracking
                  farming activities.
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


      <div className="crop-calendar-card-header">

        <div>

          <span className="calendar-small-label">
            ACTIVE CROP
          </span>


          <h2>

            {getCropEmoji(
              calendar.crop_name
            )}

            {' '}

            {calendar.crop_name}

          </h2>


          <p>
            {calendar.season}
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
            ? 'Deleting...'
            : '🗑 Delete'}

        </button>

      </div>


      <div className="calendar-summary-grid">

        <SummaryItem
          label="Sowing"

          value={
            formatDate(
              calendar.sowing_date
            )
          }
        />


        <SummaryItem
          label="Expected Harvest"

          value={
            formatDate(
              calendar.expected_harvest_date
            )
          }
        />


        <SummaryItem
          label="Progress"

          value={`${percentage}%`}
        />

      </div>


      <div className="calendar-progress">

        <div className="calendar-progress-info">

          <span>
            Farming activities
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
                        {task.title}
                      </strong>

                    </div>


                    <StatusBadge
                      status={status}
                    />

                  </div>


                  <p className="calendar-task-date">

                    {formatDate(
                      task.scheduled_date
                    )}

                  </p>


                  {task.description && (

                    <p className="calendar-task-description">

                      {task.description}

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
}) {

  const labels = {
    completed: 'Completed',
    today: 'Today',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
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

    // Full ISO datetime
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


    // YYYY-MM-DD
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
  value
) {

  const date =
    parseCalendarDate(value)


  if (!date) {
    return '—'
  }


  return date.toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
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