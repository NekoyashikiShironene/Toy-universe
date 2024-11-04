"use client";
import { useEffect, useState } from 'react';

const convertToUTC = (datetime: string) => {
  const date = new Date(datetime);

  const localOffset = date.getTimezoneOffset();

  const utcTime = date.getTime() + (14 * 60 * 60 * 1000);

  const localTime = new Date(utcTime + (localOffset * 60 * 1000));

  return localTime;
};

type TDateTime = "dt" | "t" | "d";

const formatDate = (date: Date, mode: TDateTime = "dt") => {
  switch (mode) {
    case "dt":
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      }).format(date);
    case "t":
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      }).format(date);

    case "d":
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);

    default:
      return null;
  };
}

type TimeDisplayProp = {
  utcTime: string,
  mode: TDateTime,
}


export default function TimeDisplay({ utcTime, mode }: TimeDisplayProp) {
  const [localTime, setLocalTime] = useState<Date | null>(null);

  useEffect(() => {
    const userLocalTime = new Date(convertToUTC(utcTime));
    setLocalTime(userLocalTime);
  }, [utcTime]);

  return (
    <> {localTime && formatDate(localTime, mode)} </>
  );
};