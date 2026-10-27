import test from "node:test";
import assert from "node:assert/strict";
import { parseUrlComponents, parseDataUri, parseQueryString, buildQueryString, parseKeyValue, buildKeyValue, convertNumberBase, numericView, floatView, extractNetworkCandidates, detectCompression, hexDump, extractPrintableStrings, byteStatistics, inspectNetwork, normalizeMac, parseHttpHeaders, parseCookies, numericStatistics, arithmetic, characterStatistics, compressBytes, compareByteArrays, inspectByteRange, parseDnsRecords, parseHttpMessage, inspectFileSignatures, inspectFileMetadata, inspectCertificateContainer } from "../lib/tools/extended-operations.ts";
test("query strings preserve repeated keys, plus spaces, and empty values",()=>{assert.deepEqual(JSON.parse(parseQueryString("?tag=a&tag=b&empty=&space=hello+world")),{tag:["a","b"],empty:"",space:"hello world"});assert.equal(buildQueryString('{"tag":["a","b"],"space":"hello world"}'),"tag=a&tag=b&space=hello%20world");assert.throws(()=>parseQueryString("bad=%Q"),/percent escape/i);});
test("key-value parsing preserves duplicate values and rejects malformed lines",()=>{assert.deepEqual(JSON.parse(parseKeyValue("# comment\na=1\na=2\nempty=")),{a:["1","2"],empty:""});assert.throws(()=>parseKeyValue("missing delimiter"),/key=value/i);});
test("base conversion uses BigInt for large values and validates radix",()=>{assert.equal(JSON.parse(convertNumberBase("18446744073709551615")).hexadecimal,"FFFFFFFFFFFFFFFF");assert.equal(JSON.parse(convertNumberBase("FF",16)).decimal,"255");assert.throws(()=>convertNumberBase("2",2),/digit/i);});
test("hexdump has stable offsets and printable strings are bounded",()=>{assert.match(hexDump(new TextEncoder().encode("Hello world")),/^00000000/);assert.deepEqual(extractPrintableStrings(new TextEncoder().encode("abc\0Hello world\0xy"),4),["Hello world"]);});
test("byte statistics count every byte and entropy remains a bounded indicator",()=>{const data=new Uint8Array([0,0,255,255]);const stats=JSON.parse(byteStatistics(data));assert.equal(stats.bytes,4);assert.equal(stats.topByteValues.reduce((s,x)=>s+x.count,0),4);assert.equal(stats.entropyBitsPerByte,1);});
test("IPv4/IPv6 and CIDR normalization validate bounds",()=>{assert.equal(JSON.parse(inspectNetwork("192.168.1.1")).normalized,"192.168.1.1");assert.equal(JSON.parse(inspectNetwork("2001:0db8::1")).normalized,"2001:db8::1");const cidr=JSON.parse(inspectNetwork("192.168.1.12/24","cidr"));assert.equal(cidr.network,"192.168.1.0");assert.equal(cidr.lastAddress,"192.168.1.255");assert.throws(()=>inspectNetwork("999.1.1.1"),/octets/i);});
test("MAC normalization and HTTP header duplicate reporting",()=>{assert.equal(normalizeMac("00-1a-2b-3c-4d-5e"),"00:1A:2B:3C:4D:5E");const headers=JSON.parse(parseHttpHeaders("X-Test: a\nx-test: b"));assert.deepEqual(headers.duplicates["x-test"],["a","b"]);assert.throws(()=>parseHttpHeaders("bad"),/Name: value/i);});
test("cookie parsing and numeric statistics use explicit deterministic policies",()=>{assert.deepEqual(JSON.parse(parseCookies("session=x; theme=dark")),{session:"x",theme:"dark"});const stats=JSON.parse(numericStatistics("1,2,3,4"));assert.equal(stats.mean,2.5);assert.equal(stats.median,2.5);assert.throws(()=>numericStatistics("1,no"),/finite numbers/i);});
test("arithmetic rejects division by zero and modular operation validates modulus",()=>{assert.equal(arithmetic("add",{a:"3",b:"4"}),"7");assert.throws(()=>arithmetic("divide",{a:"1",b:"0"}),/zero/i);assert.deepEqual(JSON.parse(arithmetic("modular",{a:"-3",b:"5",modulus:"7"})),{sum:"2",difference:"6",product:"6",modulus:"7"});});
test("gzip compression round-trips with bounded output",async()=>{if(typeof CompressionStream==="undefined"||typeof DecompressionStream==="undefined")return;const data=new TextEncoder().encode("repeat ".repeat(100));const packed=await compressBytes(data,"gzip","compress");const unpacked=await compressBytes(packed,"gzip","decompress");assert.deepEqual(Array.from(unpacked),Array.from(data));});

test("key-value builder round-trips supported primitive and repeated values",()=>{const text=buildKeyValue('{"host":"localhost","port":3000,"tag":["a","b"],"empty":null}');assert.equal(text,"host=localhost\nport=3000\ntag=a\ntag=b\nempty=");assert.deepEqual(JSON.parse(parseKeyValue(text)),{host:"localhost",port:"3000",tag:["a","b"],empty:""});assert.throws(()=>buildKeyValue('{"x":"line\\nbreak"}'),/Multiline values/i);});
test("network candidate extraction is offline and explicitly not validation",()=>{const r=JSON.parse(extractNetworkCandidates("See https://example.com/a, mail test@example.com, IPv6 2001:db8::1 and 192.168.1.1"));assert.deepEqual(r.urls,["https://example.com/a"]);assert.deepEqual(r.emails,["test@example.com"]);assert.deepEqual(r.ipv4Candidates,["192.168.1.1"]);assert.deepEqual(r.ipv6Candidates,["2001:db8::1"]);assert.ok(r.domainCandidates.includes("example.com"));assert.match(r.validation,/not validated/i);});
test("integer view checks signed ranges and serializes explicit endianness",()=>{const big=JSON.parse(numericView("-2",16,true,"big"));assert.equal(big.hexadecimal,"0xFFFE");assert.equal(big.bytesHex,"ff fe");const little=JSON.parse(numericView("258",16,false,"little"));assert.equal(little.bytesHex,"02 01");assert.throws(()=>numericView("128",8,true),/outside/i);});
test("IEEE-754 views return endian-specific byte representations",()=>{assert.equal(JSON.parse(floatView("1",32,"big")).hexadecimal,"0x3F800000");assert.equal(JSON.parse(floatView("1",32,"little")).hexadecimal,"0x0000803F");assert.throws(()=>floatView("1",16),/32 or 64/i);});
test("decompression enforces the output cap while streaming",async()=>{
 if(typeof CompressionStream==="undefined"||typeof DecompressionStream==="undefined")return;
 const source=new Uint8Array(9_000_000).fill(65);
 const compressed=new Uint8Array(await new Response(new Blob([source]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer());
 assert.ok(compressed.length<2_000_000);
 await assert.rejects(()=>compressBytes(compressed,"gzip","decompress"),/8,000,000 byte safety limit/i);
});
test("compression wrapper detection distinguishes gzip, zlib and unknown bytes",()=>{assert.equal(JSON.parse(detectCompression(new Uint8Array([0x1f,0x8b,0,0]))).detected,"gzip");assert.equal(JSON.parse(detectCompression(new Uint8Array([0x78,0x9c]))).detected,"zlib-wrapped DEFLATE");assert.equal(JSON.parse(detectCompression(new Uint8Array([0,1]))).detected,"unknown");});

test("numeric view accepts signed prefixed integers and rejects malformed values",()=>{assert.equal(JSON.parse(numericView("-0x2",8,true)).hexadecimal,"0xFE");assert.equal(JSON.parse(numericView("+0x2",8,false)).value,"2");assert.throws(()=>numericView("nope",8),/decimal.*hexadecimal/i);});

test("byte comparison reports exact difference offsets and length mismatch",()=>{const result=JSON.parse(compareByteArrays(Uint8Array.from([1,2,3]),Uint8Array.from([1,9,3,4])));assert.equal(result.identical,false);assert.equal(result.firstDifferenceOffset,1);assert.equal(result.lengthDifference,1);assert.equal(result.differingPositions,2);assert.equal(result.preview[0].left,"02");assert.equal(result.preview[0].right,"09");});
test("offline DNS parser recognizes common records without making network requests",()=>{const result=JSON.parse(parseDnsRecords('example.com. 3600 IN A 192.0.2.1\nexample.com. 300 IN MX 10 mail.example.com.\nexample.com. 300 IN TXT "v=spf1 -all"'));assert.equal(result.count,3);assert.equal(result.records[0].type,"A");assert.equal(result.records[1].value,"10 mail.example.com.");assert.equal(result.networkRequestsMade,false);assert.throws(()=>parseDnsRecords("this line has no known record type"),/No supported DNS records/i);});
test("HTTP message inspection redacts sensitive headers, query parameters, and URL credentials",()=>{
 const source='POST https://alice:password123@example.test/login?access_token=secret-token&mode=fast&api_key=another-secret#session=frag-secret HTTP/1.1\nHost: example.test\nAuthorization: Bearer auth-secret\nCookie: session=cookie-secret\nX-Refresh-Token: refresh-secret\nContent-Type: application/json\n\n{"password":"secret-body"}';
 const result=JSON.parse(parseHttpMessage(source));
 assert.equal(result.messageType,"request");assert.equal(result.method,"POST");
 assert.equal(result.headers.find(h=>h.name==="Authorization").value,"[REDACTED]");
 assert.equal(result.headers.find(h=>h.name==="X-Refresh-Token").value,"[REDACTED]");
 assert.equal(result.headers.find(h=>h.name==="Cookie").value,"[REDACTED]");
 assert.equal(result.body.contentIncluded,false);
 assert.equal(result.target.includes("secret-token"),false);assert.equal(result.target.includes("another-secret"),false);
 assert.match(result.target,/mode=fast/);assert.equal(result.target.includes("password123"),false);assert.equal(result.target.includes("frag-secret"),false);
 assert.equal(JSON.stringify(result).includes("secret-body"),false);assert.equal(JSON.stringify(result).includes("auth-secret"),false);
 assert.throws(()=>parseHttpMessage("not an HTTP message"),/Start line/i);
});

test("file signature inspector identifies common magic bytes without making a safety claim",()=>{const png=JSON.parse(inspectFileSignatures(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])));assert.equal(png.signatureMatches[0].format,"PNG image");assert.match(png.note,/does not.*safe/i);const unknown=JSON.parse(inspectFileSignatures(Uint8Array.from([1,2,3,4])));assert.equal(unknown.classification,"No known signature match");});

test("byte-range inspector reports bounded raw bytes with zero-based offsets",()=>{const result=JSON.parse(inspectByteRange(new TextEncoder().encode("Hello\u0000world"),4,5));assert.equal(result.offset,4);assert.equal(result.bytesReturned,5);assert.equal(result.rows[0].hex,"6f 00 77 6f 72");assert.equal(result.rows[0].ascii,"o.wor");assert.throws(()=>inspectByteRange(new Uint8Array([1]),-1,2),/offset/i);assert.throws(()=>inspectByteRange(new Uint8Array([1]),0,257),/1 to 256/i);});
test("bitwise AND OR XOR enforce width and return decimal, hex and padded binary",()=>{assert.deepEqual(JSON.parse(arithmetic("xor",{a:"12",b:"5",bits:8})),{operation:"xor",width:8,decimal:"9",hexadecimal:"0x09",binary:"00001001"});assert.equal(JSON.parse(arithmetic("and",{a:"12",b:"5",bits:8})).decimal,"4");assert.equal(JSON.parse(arithmetic("or",{a:"12",b:"5",bits:8})).decimal,"13");assert.throws(()=>arithmetic("xor",{a:"256",b:"1",bits:8}),/fit.*width/i);assert.throws(()=>arithmetic("xor",{a:"1.5",b:"1",bits:8}),/integer operands/i);});

test("bitwise NOT masks to selected width and signed operations use two's-complement ranges",()=>{assert.deepEqual(JSON.parse(arithmetic("not",{a:"0",bits:8})),{operation:"not",width:8,decimal:"255",hexadecimal:"0xFF",binary:"11111111"});assert.equal(JSON.parse(arithmetic("not",{a:"0",bits:8,signed:true})).decimal,"-1");assert.deepEqual(JSON.parse(arithmetic("xor",{a:"-1",b:"1",bits:8,signed:true})),{operation:"xor",width:8,decimal:"-2",hexadecimal:"0xFE",binary:"11111110",signed:true,unsignedDecimal:"254"});assert.throws(()=>arithmetic("xor",{a:"128",b:"1",bits:8,signed:true}),/signed 8-bit/i);assert.throws(()=>arithmetic("not",{a:"1.5",bits:8}),/integer operands/i);});

test("Unicode character statistics count code points and report bounded deterministic frequencies",()=>{const r=JSON.parse(characterStatistics("A😀Aé"));assert.equal(r.totalCodePoints,4);assert.equal(r.uniqueCodePoints,3);assert.equal(r.whitespaceCodePoints,0);assert.equal(JSON.parse(characterStatistics("a a")).whitespaceCodePoints,1);assert.equal(r.frequencies[0].character,"A");assert.equal(r.frequencies[0].count,2);assert.equal(r.frequencies.find(x=>x.character==="😀").codePoint,"U+1F600");assert.equal(JSON.parse(characterStatistics("")).totalCodePoints,0);});

test("file metadata inspector reads PNG, GIF and WAV header fields without extracting or executing files",()=>{
 const png=new Uint8Array(26);png.set([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a],0);png.set([0,0,0,2,0,0,0,3],16);png[24]=8;png[25]=6;
 const p=JSON.parse(inspectFileMetadata(png));assert.equal(p.metadata.format,"PNG");assert.equal(p.metadata.width,2);assert.equal(p.metadata.height,3);
 const gif=Uint8Array.from([..."GIF89a"].map(c=>c.charCodeAt(0)).concat([4,0,5,0]));const g=JSON.parse(inspectFileMetadata(gif));assert.equal(g.metadata.width,4);assert.equal(g.metadata.height,5);
 const wav=new Uint8Array(44+176400);wav.set([... "RIFF"].map(c=>c.charCodeAt(0)),0);wav.set([... "WAVE"].map(c=>c.charCodeAt(0)),8);wav.set([... "fmt "].map(c=>c.charCodeAt(0)),12);wav.set([16,0,0,0,1,0,2,0,0x44,0xac,0,0,0x10,0xb1,2,0,4,0,16,0],16);wav.set([... "data"].map(c=>c.charCodeAt(0)),36);wav.set([0x10,0xb1,2,0],40);
 const w=JSON.parse(inspectFileMetadata(wav));assert.equal(w.metadata.format,"WAVE");assert.equal(w.metadata.channels,2);assert.equal(w.metadata.sampleRate,44100);assert.equal(w.metadata.durationSeconds,1);
});
test("file metadata parser bounds input and safely labels unsupported bytes",()=>{
 assert.throws(()=>inspectFileMetadata(new Uint8Array(2_000_001)),/2,000,000 bytes/i);
 const result=JSON.parse(inspectFileMetadata(Uint8Array.from([1,2,3])));assert.equal(result.metadata.format,"No supported metadata parser matched");assert.match(result.caveat,/not proof/i);
});

test("JPEG and ZIP metadata readers inspect bounded headers without extracting content",()=>{
 const jpeg=Uint8Array.from([0xff,0xd8,0xff,0xc0,0,8,8,0,3,0,4,1,0xff,0xd9]);
 const j=JSON.parse(inspectFileMetadata(jpeg));assert.equal(j.metadata.format,"JPEG");assert.equal(j.metadata.width,4);assert.equal(j.metadata.height,3);assert.equal(j.metadata.components,1);
 const zip=new Uint8Array(22);zip.set([0x50,0x4b,0x05,0x06],0);zip[8]=1;zip[10]=1;zip[12]=0;zip[13]=0;zip[16]=0;zip[17]=0;
 const z=JSON.parse(inspectFileMetadata(zip));assert.equal(z.metadata.format,"ZIP archive");assert.equal(z.metadata.totalEntries,1);assert.equal(z.metadata.centralDirectoryBytes,0);
});

test("PEM container inspection reports labels and fingerprints without claiming trust",async()=>{
 const pem="-----BEGIN CERTIFICATE-----\nMAA=\n-----END CERTIFICATE-----";
 const result=JSON.parse(await inspectCertificateContainer(pem,new TextEncoder().encode(pem)));
 assert.equal(result.container,"PEM");assert.equal(result.blocks[0].pemLabel,"CERTIFICATE");assert.equal(result.blocks[0].derBytes,2);assert.match(result.blocks[0].sha256Fingerprint,/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/);assert.equal(result.trustValidated,false);
 await assert.rejects(()=>inspectCertificateContainer("-----BEGIN CERTIFICATE-----\n!!!!\n-----END CERTIFICATE-----",new TextEncoder().encode("bad")),/PEM block contains invalid Base64/i);
});
test("DER container inspection validates the outer sequence length and reports trailing bytes",async()=>{
 const result=JSON.parse(await inspectCertificateContainer("",Uint8Array.from([0x30,0x02,0x01,0x00,0xff])));
 assert.equal(result.container,"DER ASN.1 SEQUENCE");assert.equal(result.declaredContentBytes,2);assert.equal(result.trailingBytes,1);assert.equal(result.trustValidated,false);
 await assert.rejects(()=>inspectCertificateContainer("",Uint8Array.from([0x30,0x05,0x01])),/exceeds the supplied/i);
});

test("URL component parsing preserves repeated query keys and omits credential values",()=>{
 const result=JSON.parse(parseUrlComponents("https://alice:demo-passphrase@example.com:8443/a?tag=x&tag=y#part"));
 assert.equal(result.protocol,"https:");assert.equal(result.hostname,"example.com");assert.equal(result.port,"8443");assert.deepEqual(result.queryParameters.tag,["x","y"]);assert.equal(result.credentialsPresent,true);assert.equal(JSON.stringify(result).includes("demo-passphrase"),false);assert.equal(result.networkRequestsMade,false);
 assert.throws(()=>parseUrlComponents("/relative/path"),/absolute URL/i);
});

test("data URI parser handles percent and Base64 payloads as bounded bytes without executing them",()=>{
 const percent=JSON.parse(parseDataUri("data:text/plain;charset=utf-8,Hello%20GaGet.dev"));
 assert.equal(percent.mediaType,"text/plain");assert.deepEqual(percent.parameters,["charset=utf-8"]);assert.equal(percent.textPreview,"Hello GaGet.dev");assert.equal(percent.base64Encoded,false);assert.equal(percent.executed,false);
 const binary=JSON.parse(parseDataUri("data:application/octet-stream;base64,AP8B"));
 assert.equal(binary.byteLength,3);assert.equal(binary.hexPreview,"00 ff 01");assert.equal(binary.base64,"AP8B");assert.equal(binary.textPreview,null);
 assert.throws(()=>parseDataUri("https://example.com"),/beginning with data:/i);
 assert.throws(()=>parseDataUri("data:text/plain,%QZ"),/percent escape/i);
 assert.equal(JSON.parse(parseDataUri("data:text/plain;base64,SGVsbG8")).textPreview,"Hello");
 assert.equal(JSON.parse(parseDataUri("data:text/plain;base64,SGVsbG8=")).textPreview,"Hello");
 assert.equal(JSON.parse(parseDataUri("data:," )).byteLength,0);
 assert.throws(()=>parseDataUri("data:text/plain;base64,SGVsbG8!"),/Base64 data or padding/i);
 assert.throws(()=>parseDataUri("data:text/plain;base64,A"),/Base64 data or padding/i);
 assert.throws(()=>parseDataUri("data:text/plain;base64,AA="),/Base64 data or padding/i);
 assert.throws(()=>parseDataUri("data:text/plain;base64,=AAA"),/Base64 data or padding/i);
 assert.throws(()=>parseDataUri("data:text/plain,"+"x".repeat(2_000_001)),/200,000 character safety limit/i);
});

test("byte frequency includes every observed byte value and counts reconcile to input length",()=>{const result=JSON.parse(byteStatistics(new Uint8Array([0,1,1,2,255,255,255])));assert.equal(result.frequency.reduce((sum,item)=>sum+item.count,0),result.bytes);assert.deepEqual(result.frequency.map(item=>[item.byte,item.count]),[[0,1],[1,2],[2,1],[255,3]]);assert.equal(result.topByteValues.length,4);assert.equal(JSON.parse(byteStatistics(new Uint8Array())).frequency.length,0);});
test("Unicode character statistics count code points, not UTF-16 code units",()=>{const result=JSON.parse(characterStatistics("😀a😀 é"));assert.equal(result.totalCodePoints,5);assert.equal(result.uniqueCodePoints,4);assert.equal(result.frequencies[0].character,"😀");assert.equal(result.frequencies[0].count,2);assert.equal(result.unit,"Unicode code points (not grapheme clusters)");});
test("gzip and zlib compression preserve arbitrary binary bytes",async()=>{if(typeof CompressionStream==="undefined"||typeof DecompressionStream==="undefined")return;const bytes=new Uint8Array([0,255,128,0,1,13,10,254,42]);for(const format of ["gzip","deflate"]){const packed=await compressBytes(bytes,format,"compress");const unpacked=await compressBytes(packed,format,"decompress");assert.deepEqual(Array.from(unpacked),Array.from(bytes),format+" must preserve arbitrary byte values");}});
