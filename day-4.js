/*
  --- Day 4: Repose Record --- https://adventofcode.com/2018/day/4

    You've sneaked into another supply closet - this time, it's across from the prototype suit manufacturing lab.
    You need to sneak inside and fix the issues with the suit, but there's a guard stationed outside the lab,
    so this is as close as you can safely get.

    As you search the closet for anything that might help, you discover that you're not the first person to want to sneak in.
    Covering the walls, someone has spent an hour starting every midnight for the past few months secretly observing this guard post!
    They've been writing down the ID of the one guard on duty that night - the Elves seem to have decided that one guard was enough
    for the overnight shift - as well as when they fall asleep or wake up while at their post (your puzzle input).

    For example, consider the following records, which have already been organized into chronological order:

     - [1518-11-01 00:00] Guard #10 begins shift
     - [1518-11-01 00:05] falls asleep
     - [1518-11-01 00:25] wakes up
     - [1518-11-01 00:30] falls asleep
     - [1518-11-01 00:55] wakes up
     - [1518-11-01 23:58] Guard #99 begins shift
     - [1518-11-02 00:40] falls asleep
     - [1518-11-02 00:50] wakes up
     - [1518-11-03 00:05] Guard #10 begins shift
     - [1518-11-03 00:24] falls asleep
     - [1518-11-03 00:29] wakes up
     - [1518-11-04 00:02] Guard #99 begins shift
     - [1518-11-04 00:36] falls asleep
     - [1518-11-04 00:46] wakes up
     - [1518-11-05 00:03] Guard #99 begins shift
     - [1518-11-05 00:45] falls asleep
     - [1518-11-05 00:55] wakes up

    Timestamps are written using year-month-day hour:minute format. The guard falling asleep or waking up is always the one whose shift
    most recently started. Because all asleep/awake times are during the midnight hour (00:00 - 00:59),
    only the minute portion (00 - 59) is relevant for those events.

    Visually, these records show that the guards are asleep at these times:

      Date   ID   Minute
                  000000000011111111112222222222333333333344444444445555555555
                  012345678901234567890123456789012345678901234567890123456789
      11-01  #10  .....####################.....#########################.....
      11-02  #99  ........................................##########..........
      11-03  #10  ........................#####...............................
      11-04  #99  ....................................##########..............
      11-05  #99  .............................................##########.....

    The columns are Date, which shows the month-day portion of the relevant day; ID, which shows the guard on duty that day;
    and Minute, which shows the minutes during which the guard was asleep within the midnight hour.
    (The Minute column's header shows the minute's ten's digit in the first row and the one's digit in the second row.)
    Awake is shown as ., and asleep is shown as #.

    Note that guards count as asleep on the minute they fall asleep, and they count as awake on the minute they wake up.
    For example, because Guard #10 wakes up at 00:25 on 1518-11-01, minute 25 is marked as awake.

    If you can figure out the guard most likely to be asleep at a specific time, you might be able to trick that guard into working
    tonight so you can have the best chance of sneaking in. You have two strategies for choosing the best guard/minute combination.
*/

const { input, smallerInput } = require('./day-4.input')

const ACTIVE_GUARD = 'wakes up'
const SLEEP_GUARD = 'falls asleep'

const SLEEP_TAG = '#'
const WORK_TAG = '.'

const _normalize = (value, target = 0) => {
  value = value.toString()

  const difference = target - value.length
  const zeros = difference > 0 ? Array(difference).fill('0').join('') : ''

  return zeros + value
}

const Guard = (guardID) => {
  const _createShift = (filler = WORK_TAG) => Array(60).fill(filler)

  const _guardFellAsleep = (prevStatus, nextStatus) => prevStatus === ACTIVE_GUARD && nextStatus === SLEEP_GUARD
  const _guardWokeUp = (prevStatus, nextStatus) => prevStatus === SLEEP_GUARD && nextStatus === ACTIVE_GUARD

  return {
    get id() {
      return guardID
    },

    _sleepyMinutes: _createShift(0),

    _status: ACTIVE_GUARD,
    set status(value) {
      this._status = value
    },

    get status() {
      return this._status
    },

    _workDays: {},
    shiftUpdate(date, nextStatus) {
      const workDay = date.key
      const update = { prevStatus: this.status, nextStatus, minute: date.minute }

      // console.log(`Update: { was: ${ this.status }, is: ${ nextStatus }, guard: ${ this.id }, minute: ${ date.minute } }`)

      let { [workDay]: shift = _createShift() } = this._workDays

      this._workDays[workDay] = this.__shiftUpdate(shift, update)

      this.status = nextStatus
    },

    __shiftUpdate(shift, { prevStatus, nextStatus, minute }) {
      if (_guardFellAsleep(prevStatus, nextStatus)) {
        shift[minute] = SLEEP_TAG
      }

      if (_guardWokeUp(prevStatus, nextStatus)) {
        for(let sleep = shift.lastIndexOf(SLEEP_TAG); sleep < minute; sleep++) {
          shift[sleep] = SLEEP_TAG

          this._sleepyMinutes[sleep]++
        }
      }

      return shift
    },

    eachWorkDay(callback, context = this) {
      Object.keys(this._workDays).sort((dayA, dayB) => {
        return dayA < dayB ? -1 : dayA > dayB ? 1 : 0
      }).forEach((workDay) => {
        callback.call(context, workDay, this._workDays[workDay])
      })
    },

    getSleepMinutes() {
      let count = 0

      this.eachWorkDay((workDay, shift) => {
        count += shift.filter((minuteTag) => minuteTag === SLEEP_TAG).length
      })

      return count
    },

    getMostInactiveMinute() {
      let mostInactiveMinute = null

      let max = Number.MIN_VALUE
      this._sleepyMinutes.forEach((count, minute) => {
        max = Math.max(count, max)
        if(max === count) mostInactiveMinute = minute
      })

      return { count: max, mostInactiveMinute }
    },

    _getWorkDaysLog() {
      let output = []
      this.eachWorkDay((workDay, shift) => {
        output.push(`${ workDay } #${ _normalize(this.id, 4) } | ${ shift.join('') }`)
      }, this)

      return output
    },

    toString() {
      return this._getWorkDaysLog().join('\n')
    }
  }
}

const createDate = (dateISO) => {
  const _normalize = (value, target = 2) => {
    value = value.toString()

    const digits = value.length

    return digits < target ? '0' + value : value
  }

  const _date = new Date(dateISO)

  const _time = _date.getTime()

  const _day =  _date.getDate()
  const _month = _date.getMonth() + 1
  const _year = _date.getFullYear()

  const _hour = _date.getHours()
  const _minute = _date.getMinutes()

  const _key = `${ _normalize(_month, 2) }-${ _normalize(_day, 2) }`

  return {
    get key() {
      return _key
    },

    get time() {
      return _time
    },

    get day() {
      return _day
    },

    get month() {
      return _month
    },

    get year() {
      return _year
    },

    get hour() {
      return _hour
    },

    get minute() {
      return _minute
    }
  }
}

const parseActivityLog = (log) => {
  const [ /*match*/, dateISO, message ]= /\[([^\]]+)\],(.+)/.exec(log)

  const isStatusUpdate = message === ACTIVE_GUARD || message === SLEEP_GUARD

  const status = !isStatusUpdate ? /#(\d+)/.exec(message)[1] : message

  return { date: createDate(dateISO), status, isStatusUpdate }
}

const calculateGuardShifts = (entries) => {
  const guards = {}

  let guardOnDuty = null
  entries.forEach(({ date, status, isStatusUpdate }) => {
    if (!isStatusUpdate) {
      const { [status]: _guard } = guards

      if (_guard == null ) {
        guards[status] = Guard(status)
      }

      guardOnDuty = status
    }

    if (guardOnDuty != null && isStatusUpdate) {
      guards[guardOnDuty].shiftUpdate(date, status)
    }
  })

  return guards
}

const getMostSleepyMinuteGuard = (guardList) => {
  let moreTimes = Number.MIN_VALUE

  let sleepy = null
  Object.values(guardList).map((guard) => {
    const { count, mostInactiveMinute } = guard.getMostInactiveMinute()

    moreTimes = Math.max(moreTimes, count)
    if (moreTimes === count) {
      sleepy = guard
    }
  })

  return sleepy
}

const getMostSleepyGuard = (guardList) => {
  let moreSleep = Number.MIN_VALUE

  let sleepy = null
  Object.values(guardList).map((guard) => {
    const guardSleepTime = guard.getSleepMinutes()

    moreSleep = Math.max(moreSleep, guardSleepTime)
    if (moreSleep === guardSleepTime) {
      sleepy = guard
    }
  })

  return sleepy
}

const logGuardsWorkDays = (guardsShifts, mostSleepyGuard, mostInactiveMinute) => {
  let allShifts = []

  Object.values(guardsShifts).forEach((guard) => allShifts.push(...guard._getWorkDaysLog()))

  console.log(` +-------------+------------------------------------------------------------- +`)
  console.log(` | DAY   #ID   | Minutes                                                      |`)
  console.log(` +-------------+--------------------------------------------------------------+`)
  console.log(` |             | 000000000011111111112222222222333333333344444444445555555555 |`)
  console.log(` |             | 012345678901234567890123456789012345678901234567890123456789 |`)
  console.log(` +-------------+------------------------------------------------------------- +`)

  allShifts.sort((shiftA, shiftB) => {
    return shiftA < shiftB ? -1 : shiftA > shiftB ? 1 : 0
  }).forEach((shift) => console.log(` | ${ shift } |`))

  console.log(` +-------------+------------------------------------------------------------- +`)

  // console.log(`\n  > Most Sleepy Guard: ${ mostSleepyGuard.id }\n  > Was most asleep during minute: ${ mostInactiveMinute }\n`)
}

// ---

const partOne = (activityLogList = []) => {
  const entries = activityLogList.map((activityLog) => {
    return parseActivityLog(activityLog)
  }).sort(({ date: dateA }, { date: dateB }) => {
    return dateA.time < dateB.time ? -1 : dateA.time > dateB.time ? 1 : 0
  })

  const guardsShifts = calculateGuardShifts(entries)
  const mostSleepyGuard = getMostSleepyGuard(guardsShifts)
  const { mostInactiveMinute } = mostSleepyGuard.getMostInactiveMinute()

  // logGuardsWorkDays(guardsShifts, mostSleepyGuard, mostInactiveMinute)

  console.log(` P1: What is the ID of the guard you chose multiplied by the minute you chose?`)
  console.log(` A1: '${ mostSleepyGuard.id } * ${ mostInactiveMinute } = ${ mostSleepyGuard.id * mostInactiveMinute }'\n`)
}

const partTwo = (activityLogList = []) => {
  const entries = activityLogList.map((activityLog) => {
    return parseActivityLog(activityLog)
  }).sort(({ date: dateA }, { date: dateB }) => {
    return dateA.time < dateB.time ? -1 : dateA.time > dateB.time ? 1 : 0
  })

  const guardsShifts = calculateGuardShifts(entries)
  const mostSleepyGuard = getMostSleepyMinuteGuard(guardsShifts)
  const { mostInactiveMinute } = mostSleepyGuard.getMostInactiveMinute()

  // logGuardsWorkDays(guardsShifts, mostSleepyGuard, mostInactiveMinute)

  console.log(` P2: What is the ID of the guard you chose multiplied by the minute you chose?`)
  console.log(` A2: '${ mostSleepyGuard.id } * ${ mostInactiveMinute } = ${ mostSleepyGuard.id * mostInactiveMinute }'`)
}

// ----

console.log('##### Day 4 #####')

/*
  --- Part One ---

    Strategy 1: Find the guard that has the most minutes asleep. What minute does that guard spend asleep the most?

    In the example above, Guard #10 spent the most minutes asleep, a total of 50 minutes (20+25+5), while Guard #99 only slept for a total of 30 minutes (10+10+10). Guard #10 was asleep most during minute 24 (on two days, whereas any other minute the guard was asleep was only seen on one day).

    While this example listed the entries in chronological order, your entries are in the order you found them. You'll need to organize them before they can be analyzed.

    What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)
*/
partOne(input)

/*
  --- Part Two ---

    Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?

    In the example above, Guard #99 spent minute 45 asleep more than any other guard or minute - three times in total.
    (In all other cases, any guard spent any minute asleep at most twice.)

    What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 99 * 45 = 4455.)
*/
partTwo(input)
