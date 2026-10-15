import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout";
import { DateTimeWorkbench } from "@/components/datetime-workbench";

const entries = [
["world-clock","World Clock & Time Zone Converter","Compare live clocks and convert dates between selected IANA time zones."],
["calendar","Calendar","Browse a monthly calendar and print it from your browser."],
["date-calculator","Date Calculator","Add or subtract days, weeks, months, or years from a date."],
["timestamp","Date Formatter & Timestamp Converter","Convert Unix timestamps and ISO date strings to readable formats."],
["countdown","Countdown & Event Timer","Count down to a date or see how long ago it occurred."],
["date-converter","Date Converter","View Gregorian dates using calendar systems supported by your browser."],
["date-difference","Date Difference Calculator","Calculate the elapsed days and approximate weeks or months between dates."],
["business-days","Business Days Calculator","Count weekdays between two dates with configurable weekend days."],
["week-number","Week Number Calculator","Calculate the ISO week number and week-year."],
["leap-year","Leap Year Checker","Check leap years and the number of days in a year."],
["age","Age Calculator","Calculate age from a birth date and an as-of date."],
["duration","Time Duration Calculator","Convert a duration in seconds to hours, minutes, and seconds."],
["meeting-planner","Time Zone Meeting Planner","Compare times across selected cities to help coordinate meetings."],
["date-format","Date Format Playground","Preview common date formats and locale-specific representations."],
["calendar-generator","Calendar Generator","Generate and print a monthly calendar."],
["ics-viewer","ICS Calendar Viewer","Open and inspect an ICS calendar file locally."],
["ics-generator","ICS Event Generator","Create a downloadable ICS event for calendar apps."],
["holidays","Holiday Calendar","Browse a small sample of common fixed-date holidays."],
["json","Date/Time JSON Converter","Convert a date into ISO, UTC, and Unix timestamp representations."],
["cron","Cron Schedule Helper","Inspect the five fields of a common cron expression."],
] as const;
export function generateStaticParams(){return entries.map(([tool])=>({tool}));}
export async function generateMetadata({params}:{params:Promise<{tool:string}>}):Promise<Metadata>{const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);if(!entry)return {title:"Date & Time Tools | GaGet.dev"};return {title:entry[1]+" | GaGet.dev",description:entry[2],alternates:{canonical:"/datetime/"+tool},openGraph:{title:entry[1],description:entry[2],url:"/datetime/"+tool,type:"website"}};}
export default async function DateTimeToolPage({params}:{params:Promise<{tool:string}>}){const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);if(!entry)notFound();return <ToolLayout category="Date & Time" title={entry[1]} description={entry[2]}><DateTimeWorkbench slug={tool}/></ToolLayout>}
