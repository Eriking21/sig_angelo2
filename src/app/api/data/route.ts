"use server";
import lockfile from "proper-lockfile";
import fs, { promises as fs2 } from "fs";
import { ClientContent } from "@/AddingForm/getPostContent";
import { NextRequest, NextResponse } from "next/server";
import {
  CON_SE_Info,
  CON_TRAFO_Info,
  Trafo_Info,
  erimServerData,
  erim_vec,
} from "./types";
import { triggerRefresh } from "./refresh/route";
import { revalidateTag } from "next/cache";

export async function getData(): Promise<erimServerData> {
  "use server";
  let subs: erimServerData["subs"] = JSON.parse(
    await fs2.readFile("./data/SE_info.json", { encoding: "utf8" })
  );
  
  const [CON_SE, CON_TRAFO, ...trafos] = [
    JSON.parse(
      await fs2.readFile("./data/CON_SE.json", { encoding: "utf8" })
    ) as erimServerData["CON_SE"],
    JSON.parse(
      await fs2.readFile("./data/CON_TRAFO.json", { encoding: "utf8" })
    ) as erimServerData["CON_TRAFO"],
    ...Object.keys(subs).map((k) => {
      const file = `./data/SE${k}.json`;
      return fs.existsSync(file)
        ? fs2
            .readFile(file, { encoding: "utf8" })
            .then((file) => JSON.parse(file) as erim_vec<Trafo_Info>)
        : Promise.resolve({} as erim_vec<Trafo_Info>);
    }),
  ];
  const T = await Promise.all([...trafos])
  const C: erimServerData["consumers"] = []

  
  return {
    subs: subs,
    trafos: T,
    consumers: C,
    CON_SE: CON_SE,
    CON_TRAFO: CON_TRAFO,
  };
}


export async function POST(request: NextRequest) {
  const a: ClientContent = await request.json();
  let num = a.mainLine;
  let file = "SE";

  if (num === undefined) {
    a.info.attributes.FID = 0;
    file += "_info";
  } else if (num < 1000) {
    a.info.attributes.FID = 1000;
    file += num;
  } else {
    file += "_PT" + num;
  }

  await lockfile.lock("./data/index.json").catch((err) => {
    console.log("locking Error");
  });

  const max: { [key: string]: number } = JSON.parse(
    await fs2.readFile("./data/index.json", encoding)
  );

  max[file] ??= 0;
  a.info.attributes.FID = (num ?? 1000) * 1000 + max[file]++;

  let list: ClientContent["info"][] = fs.existsSync(`./data/${file}.json`)
    ? JSON.parse(await fs2.readFile(`./data/${file}.json`, encoding))
    : [];

  list.push(a.info);

  const [CON_SE, CON_TRAFO]: [CON_SE_Info[], CON_TRAFO_Info[]] = [
    JSON.parse(await fs2.readFile("./data/CON_SE.json", encoding)),
    JSON.parse(await fs2.readFile("./data/CON_TRAFO.json", encoding)),
  ];
  a.connections.forEach((conn) => {
    let target = a.info.attributes.FID!;
    if (target < 1000) {
      CON_SE.push({ "0": target, "1": conn, power: "0W" });
    } else {
      target -= 1000;
      CON_TRAFO.push({
        "0": [Math.floor(target / 1000), target % 1000],
        "1": [Math.floor(conn / 1000), conn % 1000],
        power: "0W",
      });
    }
  });
  await Promise.all([
    fs2.writeFile("./data/index.json", JSON.stringify(max)),
    fs2.writeFile(`./data/${file}.json`, JSON.stringify(list)),
    fs2.writeFile("./data/CON_SE.json", JSON.stringify(CON_SE)),
    fs2.writeFile("./data/CON_TRAFO.json", JSON.stringify(CON_TRAFO)),
  ]);

  await lockfile.unlock("./data/index.json");
  revalidateTag("update_features");
  triggerRefresh();
  return new NextResponse("ok");
}

export async function GET(request: NextRequest) {
  "use server";
  return NextResponse.json(await getData());//(JSON.stringify());
}

export async function PUT(request: NextRequest) {
    "use server";
  const { info }: ClientContent = await request.json();
  let i = info.attributes.FID!;
  console.log("put:", info);

  let path = `./data/SE${
    i < 1000 ? "_info" : Math.floor((i - 1000) / 1000)
  }.json`;

  console.log({ info, path,i });
  i %= 1000;

  if (fs.existsSync(path)) {
    await lockfile.lock("./data/index.json").catch(onlockError);
    let list: (typeof info)[] = JSON.parse(await fs2.readFile(path, encoding));
    if (i < list.length) {
      list[i] = {...list[i],...info};
      await fs2.writeFile(path, JSON.stringify(list));
      await lockfile.unlock("./data/index.json");
      triggerRefresh();
      return new NextResponse("ok");
    }
    await lockfile.unlock("./data/index.json");
  }

  return new NextResponse("failed");
}

const encoding = { encoding: "utf8" as BufferEncoding };
const onlockError = (err: any) => {
  console.log("locking Error");
};