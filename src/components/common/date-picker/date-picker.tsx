"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DatePickerRangeValue {
  from?: string
  to?: string
}

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  rangeValue?: DatePickerRangeValue
  onRangeChange?: (value: DatePickerRangeValue | undefined) => void
  placeholder?: string
  rangePlaceholder?: string
  disabled?: boolean
  className?: string
  showTime?: boolean
  allowClear?: boolean
  enableRange?: boolean
}

const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

const setTimeOnDate = (date: Date, timeValue: string): Date => {
  const [hoursRaw, minutesRaw] = timeValue.split(":")
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return date
  }

  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

const toLocalDateTimeValue = (date: Date): string => {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const parseLocalDateTime = (value?: string): Date | undefined => {
  if (!value) {
    return undefined
  }

  const [datePart, timePart] = value.split("T")
  if (!datePart) {
    return undefined
  }

  const [yearRaw, monthRaw, dayRaw] = datePart.split("-")
  const [hourRaw, minuteRaw] = (timePart ?? "00:00").split(":")

  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return undefined
  }

  return new Date(year, month - 1, day, hour, minute)
}

export function DatePicker({
  value,
  onChange,
  rangeValue,
  onRangeChange,
  placeholder = "Selecciona fecha",
  rangePlaceholder = "Selecciona un rango de fechas",
  disabled,
  className,
  showTime = false,
  allowClear = false,
  enableRange = false,
}: DatePickerProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState("")
  const [internalRange, setInternalRange] = React.useState<
    DatePickerRangeValue | undefined
  >(undefined)

  const selectedValue = isControlled ? value ?? "" : internalValue
  const selectedRangeValue = enableRange ? rangeValue ?? internalRange : undefined
  const selectedRange = React.useMemo<DateRange | undefined>(() => {
    if (!enableRange) {
      return undefined
    }

    const from = parseLocalDateTime(selectedRangeValue?.from)
    const to = parseLocalDateTime(selectedRangeValue?.to)

    if (!from && !to) {
      return undefined
    }

    return { from, to }
  }, [enableRange, selectedRangeValue])
  const selectedDate = React.useMemo(
    () => parseLocalDateTime(selectedValue),
    [selectedValue],
  )

  const mapDateRangeToValue = React.useCallback(
    (nextRange?: DateRange): DatePickerRangeValue | undefined => {
      if (!nextRange?.from && !nextRange?.to) {
        return undefined
      }

      return {
        from: nextRange.from ? toLocalDateTimeValue(nextRange.from) : undefined,
        to: nextRange.to ? toLocalDateTimeValue(nextRange.to) : undefined,
      }
    },
    [],
  )

  const emitRangeChange = React.useCallback(
    (nextRange: DatePickerRangeValue | undefined) => {
      if (rangeValue === undefined) {
        setInternalRange(nextRange)
      }
      onRangeChange?.(nextRange)
    },
    [onRangeChange, rangeValue],
  )

  const emitChange = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  const handleDateSelect = React.useCallback(
    (nextDate?: Date) => {
      if (!nextDate) {
        emitChange("")
        return
      }

      const result = new Date(nextDate)
      if (showTime) {
        if (selectedDate) {
          result.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0)
        }
      } else {
        result.setHours(0, 0, 0, 0)
      }

      emitChange(toLocalDateTimeValue(result))
    },
    [emitChange, selectedDate, showTime],
  )

  const handleTimeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [hoursRaw, minutesRaw] = event.target.value.split(":")
      const hours = Number(hoursRaw)
      const minutes = Number(minutesRaw)

      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return
      }

      const baseDate = selectedDate ? new Date(selectedDate) : new Date()
      baseDate.setHours(hours, minutes, 0, 0)
      emitChange(toLocalDateTimeValue(baseDate))
    },
    [emitChange, selectedDate],
  )

  const handleRangeSelect = React.useCallback(
    (nextRange: DateRange | undefined) => {
      if (!nextRange) {
        emitRangeChange(undefined)
        return
      }

      const nextFrom = nextRange.from ? new Date(nextRange.from) : undefined
      const nextTo = nextRange.to ? new Date(nextRange.to) : undefined

      if (showTime) {
        if (nextFrom && selectedRange?.from) {
          nextFrom.setHours(
            selectedRange.from.getHours(),
            selectedRange.from.getMinutes(),
            0,
            0,
          )
        }

        if (nextTo && selectedRange?.to) {
          nextTo.setHours(
            selectedRange.to.getHours(),
            selectedRange.to.getMinutes(),
            0,
            0,
          )
        }
      }

      emitRangeChange(mapDateRangeToValue({ from: nextFrom, to: nextTo }))
    },
    [emitRangeChange, mapDateRangeToValue, selectedRange, showTime],
  )

  const handleRangeFromTimeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedRange?.from) {
        return
      }

      const nextFrom = setTimeOnDate(selectedRange.from, event.target.value)
      emitRangeChange(
        mapDateRangeToValue({ from: nextFrom, to: selectedRange.to }),
      )
    },
    [emitRangeChange, mapDateRangeToValue, selectedRange],
  )

  const handleRangeToTimeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedRange?.to) {
        return
      }

      const nextTo = setTimeOnDate(selectedRange.to, event.target.value)
      emitRangeChange(
        mapDateRangeToValue({ from: selectedRange.from, to: nextTo }),
      )
    },
    [emitRangeChange, mapDateRangeToValue, selectedRange],
  )

  const rangeLabel = React.useMemo(() => {
    if (!selectedRange?.from) {
      return rangePlaceholder
    }

    if (!selectedRange.to) {
      return format(selectedRange.from, showTime ? "PPP p" : "PPP", {
        locale: es,
      })
    }

    return `${format(selectedRange.from, showTime ? "PPP p" : "PPP", {
      locale: es,
    })} - ${format(
      selectedRange.to,
      showTime ? "PPP p" : "PPP",
      { locale: es },
    )}`
  }, [rangePlaceholder, selectedRange, showTime])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={enableRange ? !selectedRange?.from : !selectedDate}
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {enableRange
              ? rangeLabel
              : selectedDate
              ? format(selectedDate, showTime ? "PPP p" : "PPP", { locale: es })
              : placeholder}
          </span>
          <ChevronDownIcon className="size-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {showTime && enableRange ? (
          <div className="border-b p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Hora inicio</p>
                <Input
                  type="time"
                  value={selectedRange?.from ? formatTime(selectedRange.from) : ""}
                  onChange={handleRangeFromTimeChange}
                  disabled={disabled || !selectedRange?.from}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Hora fin</p>
                <Input
                  type="time"
                  value={selectedRange?.to ? formatTime(selectedRange.to) : ""}
                  onChange={handleRangeToTimeChange}
                  disabled={disabled || !selectedRange?.to}
                />
              </div>
            </div>
          </div>
        ) : null}
        {showTime && !enableRange ? (
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" />
              <Input
                type="time"
                value={selectedDate ? formatTime(selectedDate) : ""}
                onChange={handleTimeChange}
                disabled={disabled}
              />
            </div>
          </div>
        ) : null}
        {enableRange ? (
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleRangeSelect}
            defaultMonth={selectedRange?.from}
            numberOfMonths={2}
            locale={es}
          />
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate}
            locale={es}
          />
        )}
        <div className="border-t p-3">
          {allowClear ? (
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-full"
              onClick={() => {
                if (enableRange) {
                  emitRangeChange(undefined)
                  return
                }
                emitChange("")
              }}
              disabled={disabled}
            >
              {enableRange ? "Limpiar rango" : "Limpiar fecha"}
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
