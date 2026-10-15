import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout";
import { AudioWorkbench } from "@/components/audio-workbench";

const entries = [
["editor","Audio Editor","Edit, trim, adjust volume, preview, and export supported audio locally."],
["converter","Audio Converter","Decode browser-supported audio and export a WAV file without uploading it."],
["compressor","Audio Compressor","Reduce WAV output size by changing sample rate and channel count."],
["volume","Audio Volume Changer","Adjust gain and export a normalized-volume WAV copy."],
["trimmer","Audio Trimmer & Ringtone Maker","Select a clip by start and end timestamps and export a WAV ringtone."],
["merger","Audio Merger","Join multiple supported audio files in sequence and export WAV."],
["splitter","Audio Splitter","Export a selected initial segment from a supported audio file."],
["speed","Audio Speed Changer","Preview audio playback at different speeds."],
["pitch","Audio Pitch Changer","Explore playback speed controls; pitch-shift export is not yet supported."],
["metadata","Audio Metadata Viewer","Inspect decoded duration, sample rate, channels, file type, and size."],
["metadata-editor","Audio Metadata Editor","Inspect audio metadata; embedded tag editing is not yet supported."],
["to-wav","Audio to WAV","Decode supported audio and export 16-bit PCM WAV."],
["base64","Audio to Base64","Convert a local audio file into a Base64 data URL."],
["base64-to-audio","Base64 to Audio","Decode Base64 bytes and download the result."],
["silence-detector","Silence Detector","Estimate quiet intervals from a decoded audio waveform."],
["waveform","Audio Waveform Generator","Inspect a local audio waveform in your browser."],
["frequency","Audio Frequency Analyzer","Inspect the decoded waveform and basic sample information."],
["recorder","Microphone Recorder","Record microphone audio with browser permission."],
] as const;
export function generateStaticParams(){return entries.map(([tool])=>({tool}));}
export async function generateMetadata({params}:{params:Promise<{tool:string}>}):Promise<Metadata>{const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);if(!entry)return {title:"Audio Tools | GaGet.dev"};return {title:entry[1]+" Online | GaGet.dev",description:entry[2],alternates:{canonical:"/audio/"+tool},openGraph:{title:entry[1],description:entry[2],url:"/audio/"+tool,type:"website"}};}
export default async function AudioToolPage({params}:{params:Promise<{tool:string}>}){const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);if(!entry)notFound();return <ToolLayout category="Audio" title={entry[1]} description={entry[2]}><AudioWorkbench slug={tool}/></ToolLayout>}
