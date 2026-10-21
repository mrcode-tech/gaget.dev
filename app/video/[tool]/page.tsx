import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { VideoWorkbench } from "@/components/video-workbench";

const entries = [
 ["editor","Video Editor","Trim and split supported ranges, inspect metadata, capture frames, and export browser-supported recordings. Advanced merge/mux, broad conversion, GIF encoding, reverse export, and stabilization may be unavailable or browser-dependent."],
 ["trim","Video Trimmer","Select a video range and export a browser-supported WebM recording."],
 ["split","Video Splitter","Select and export a video segment locally."],
 ["merge","Video Merger","Prepare multiple local video clips for merging."],
 ["crop","Video Crop, Rotate & Flip","Transform video preview and export a new local recording."],
 ["watermark","Video Text & Watermark","Overlay text on video previews and supported exports."],
 ["reverse","Video Reverser","Explore reverse-video processing options."],
 ["color","Video Color Adjustments","Adjust brightness, contrast, and saturation."],
 ["speed","Video Speed Changer","Preview and record video at a different speed."],
 ["audio","Video Audio Track Editor","Control source-video audio playback."],
 ["stabilize","Video Stabilization","Explore browser-side stabilization options."],
 ["metadata","Video Metadata Viewer","Inspect local video metadata and dimensions."],
 ["frames","Video Frame Extractor","Capture a frame as a PNG image."],
 ["thumbnail","Video Thumbnail Generator","Create a thumbnail from a selected frame."],
 ["subtitles","Video Subtitle Editor","Inspect and export subtitle sidecars."],
 ["compare","Video Comparison","Compare source and adjusted preview."],
 ["convert","Video Converter","Export supported browser-native WebM recordings."],
 ["compress","Video Compressor","Resize and record a smaller WebM output."],
 ["resolution","Video Resolution & Frame Rate Converter","Choose output dimensions and frame rate."],
 ["extract-audio","Video to Audio","Review local video-to-audio options."],
 ["gif","Video to GIF","Review frame extraction and GIF export options."],
 ["clean-metadata","Video Metadata Cleaner","Create a new browser-recorded output without source-container metadata."],
 ["base64","Video Base64 Encoder / Decoder","Encode local video data or decode pasted Base64."],
 ["record","Video Recorder","Record a local video canvas where browser support permits."]
] as const;

export function generateStaticParams(){ return entries.map(([tool])=>({tool})); }
export async function generateMetadata({params}:{params:Promise<{tool:string}>}):Promise<Metadata>{
 const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);
 if(!entry)return {title:"Video Tools | GaGet.dev"};
 return {title:entry[1]+" Online | GaGet.dev",description:entry[2],alternates:{canonical:"/video/editor"},openGraph:{title:entry[1],description:entry[2],url:"/video/editor",type:"website"}};
}
export default async function VideoToolPage({params,searchParams}:{params:Promise<{tool:string}>;searchParams:Promise<{feature?:string|string[]}>}){
 const {tool}=await params;const entry=entries.find(([slug])=>slug===tool);if(!entry)notFound();
 if(tool!=="editor")redirect("/video/editor?feature="+encodeURIComponent(tool));
 const query=await searchParams;const requested=Array.isArray(query.feature)?query.feature[0]:query.feature;
 const feature=entries.some(([slug])=>slug===requested)?requested!:"editor";
 return <VideoWorkbench slug={feature}/>;
}
