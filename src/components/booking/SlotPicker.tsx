'use client';

import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface SlotPickerProps {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSlotSelect: (slot: AvailabilitySlot) => void;
  isLoading?: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSlotSelect,
  isLoading = false,
}) => {
  // Extract unique dates from slots
  const dates = Array.from(
    new Set(
      slots.map((s) => {
        const d = new Date(s.startTime);
        return d.toISOString().split('T')[0];
      })
    )
  ).sort();

  const [selectedDate, setSelectedDate] = useState<string>(dates[0] || '');

  // Filter slots for the active date
  const activeDateSlots = slots.filter((s) => s.startTime.startsWith(selectedDate));

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Group into time periods
  const morningSlots = activeDateSlots.filter((s) => new Date(s.startTime).getHours() < 12);
  const afternoonSlots = activeDateSlots.filter(
    (s) => new Date(s.startTime).getHours() >= 12 && new Date(s.startTime).getHours() < 16
  );
  const eveningSlots = activeDateSlots.filter((s) => new Date(s.startTime).getHours() >= 16);

  const renderSlotGroup = (title: string, groupSlots: AvailabilitySlot[]) => {
    if (groupSlots.length === 0) return null;

    return (
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h4
          style={{
            fontSize: 'var(--font-size-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-border-muted)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {title}
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {groupSlots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            const isAvailable = slot.status === 'AVAILABLE';
            const isHeld = slot.status === 'HELD';
            const isBooked = slot.status === 'BOOKED';

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable || isLoading}
                onClick={() => onSlotSelect(slot)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  backgroundColor: isSelected
                    ? 'var(--color-text-primary)'
                    : isAvailable
                    ? 'var(--color-surface-raised)'
                    : 'var(--color-surface-muted)',
                  color: isSelected
                    ? 'var(--color-surface-raised)'
                    : isAvailable
                    ? 'var(--color-text-primary)'
                    : '#888888',
                  border: isSelected
                    ? '2px solid var(--color-text-primary)'
                    : isAvailable
                    ? '1.5px solid var(--color-border-muted)'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--motion-duration-fast)',
                }}
              >
                <span>{formatTime(slot.startTime)}</span>
                {isHeld && <span style={{ fontSize: '10px', color: '#855309' }}>• Held</span>}
                {isBooked && <span style={{ fontSize: '10px', color: '#888' }}>• Booked</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="amrutam-card" style={{ padding: 'var(--space-8)' }}>
      <h3 style={{ fontSize: '19px', marginBottom: 'var(--space-6)' }}>
        Select Consultation Appointment Time
      </h3>

      {/* Date Selector Strip */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: 'var(--space-8)',
          borderBottom: '1px solid rgba(58, 100, 59, 0.15)',
        }}
      >
        {dates.map((dateStr) => {
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => setSelectedDate(dateStr)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? 'var(--color-border-muted)' : 'var(--color-surface-muted)',
                color: isSelected ? 'var(--color-surface-raised)' : 'var(--color-text-primary)',
                border: isSelected ? '1px solid var(--color-border-muted)' : '1px solid rgba(58, 100, 59, 0.2)',
                transition: 'all var(--motion-duration-fast)',
              }}
            >
              {formatDateHeader(dateStr)}
            </button>
          );
        })}
      </div>

      {/* Slots Buckets */}
      {activeDateSlots.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', padding: '20px 0' }}>
          No consultation slots scheduled for this day. Please pick another date.
        </p>
      ) : (
        <>
          {renderSlotGroup('Morning (09:00 - 12:00)', morningSlots)}
          {renderSlotGroup('Afternoon (12:00 - 16:00)', afternoonSlots)}
          {renderSlotGroup('Evening (16:00 - 19:00)', eveningSlots)}
        </>
      )}

      {/* Distributed Concurrency Explanatory Note */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          padding: '12px',
          backgroundColor: 'var(--color-surface-muted)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '13px',
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>🔒</span>
        <span>
          <strong>Zero Double-Booking Guarantee:</strong> Selecting an available slot locks it exclusively
          for you for 10 minutes via distributed Redis Redlock, ensuring no simultaneous patient overlap.
        </span>
      </div>
    </div>
  );
};
