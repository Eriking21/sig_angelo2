import { NextRequest, NextResponse } from "next/server";

const writers = new Set<ReturnType<TransformStream["writable"]["getWriter"]>>();

export function triggerRefresh() {
  console.log("triggering Refresh");
  writers.forEach((writer) => {
    writer.write(new TextEncoder().encode(`event: update\n`));
    writer.write(new TextEncoder().encode(`data: new changes\n\n`));
    console.log("Refresh triggered");
  });
}

export async function GET(request: NextRequest) {
  const stream = new TransformStream<Uint8Array>();
  const writer = stream.writable.getWriter();
  writers.add(writer);
  console.log("connection start");
  stream.readable.cancel = async (r) => {
    writers.delete(writer);
    console.log("connection stop");
    return stream.readable.cancel(r);
  };

  console.log("new refresh");
  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
