'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, subDays, startOfDay, endOfDay, startOfYear, endOfYear } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DateRangePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Update temp state when external date changes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempDate(date);
    }
    setIsOpen(open);
  };

  // Quick select - immediately apply and close
  const setRangeAndApply = (days: number) => {
    const newRange = { from: subDays(new Date(), days), to: new Date() };
    setDate(newRange);
    setIsOpen(false);
  };

  const setTodayAndApply = () => {
    const newRange = { from: startOfDay(new Date()), to: endOfDay(new Date()) };
    setDate(newRange);
    setIsOpen(false);
  };

  const setYesterdayAndApply = () => {
    const yesterday = subDays(new Date(), 1);
    const newRange = { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    setDate(newRange);
    setIsOpen(false);
  };

  const setThisYearAndApply = () => {
    const now = new Date();
    const newRange = { from: startOfYear(now), to: endOfYear(now) };
    setDate(newRange);
    setIsOpen(false);
  };

  const handleApply = () => {
    setDate(tempDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  const handleClearAndApply = () => {
    setDate(undefined);
    setIsOpen(false);
  };

  const formatDateForButton = (date: DateRange | undefined) => {
    if (!date?.from) return 'Select Date';

    if (date.to) {
      if (isMobile) {
        // Shorter format for mobile
        return `${format(date.from, 'MMM dd')} - ${format(date.to, 'MMM dd, y')}`;
      }
      return `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`;
    }

    return format(date.from, isMobile ? 'MMM dd, y' : 'LLL dd, y');
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            'w-auto justify-start text-left font-medium h-10 px-3 py-2',
            'hover:bg-gray-50 transition-colors duration-200',
            'min-w-0', // Allow button to shrink
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{formatDateForButton(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0 flex flex-col shadow-lg',
          isMobile
            ? 'w-screen max-w-xs mx-4' // Mobile: full width with margins
            : 'w-auto' // Desktop: auto width
        )}
        align={isMobile ? 'center' : 'end'}
        side={isMobile ? 'bottom' : 'bottom'}
        sideOffset={8}
      >
        <div
          className={cn(
            'flex',
            isMobile ? 'flex-col' : 'flex-row' // Stack vertically on mobile
          )}
        >
          {/* Quick Select Sidebar */}
          <div
            className={cn(
              'flex space-y-1 p-3 bg-gray-50/50',
              isMobile
                ? 'flex-row overflow-auto gap-1 space-y-0 border-b border-gray-200' // Horizontal on mobile
                : 'flex-col border-r border-gray-200 min-w-[140px]' // Vertical on desktop
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile
                  ? 'text-xs h-7 px-2 flex-1 w-max' // Smaller on mobile
                  : 'text-sm h-8 px-3'
              )}
              onClick={setTodayAndApply}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
              )}
              onClick={setYesterdayAndApply}
            >
              Yesterday
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
              )}
              onClick={() => setRangeAndApply(6)}
            >
              Last 7 days
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
              )}
              onClick={() => setRangeAndApply(29)}
            >
              Last 30 days
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
              )}
              onClick={() => setRangeAndApply(89)}
            >
              Last 90 days
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'justify-start hover:text-primary',
                isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
              )}
              onClick={setThisYearAndApply}
            >
              This year
            </Button>
            <div className={cn(isMobile ? 'w-full' : 'pt-2 border-t border-gray-200 mt-2')}>
              <Button
                variant="ghost"
                className={cn(
                  'justify-start hover:text-red-600 text-red-500',
                  isMobile ? 'text-xs h-7 px-2 flex-1 w-max' : 'text-sm h-8 px-3'
                )}
                onClick={handleClearAndApply}
              >
                Clear dates
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <div className="overflow-hidden">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempDate?.from || date?.from}
              selected={tempDate}
              onSelect={setTempDate}
              numberOfMonths={1}
              showOutsideDays={!isMobile} // Hide outside days on mobile for cleaner look
              captionLayout="dropdown-buttons"
              fromYear={new Date().getFullYear() - 10}
              toYear={new Date().getFullYear() + 10}
              className={cn(
                'p-3',
                isMobile && 'scale-95 origin-center' // Slightly smaller on mobile
              )}
              classNames={{
                caption_label: 'hidden',
                dropdown: cn(
                  'bg-white border border-gray-200 rounded px-2 py-1',
                  'hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                  'appearance-none cursor-pointer',
                  isMobile ? 'text-xs min-w-[70px]' : 'text-sm w-max'
                ),
                dropdown_month: 'mr-2',
                dropdown_year: '',
                caption_dropdowns: 'flex gap-2 items-center justify-center',
                vhidden: 'hidden',
                table: isMobile ? 'text-sm' : '',
              }}
            />
          </div>
        </div>

        {/* Apply/Cancel Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-3 py-2 bg-gray-50/30">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply} disabled={!tempDate?.from}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
