import db from "../../db.server";
import { DidDto } from "../dtos/identity/Did.dto";

export async function createDid(data: DidDto) {
  const did = await db.did.create({
    data: {
      identifier: data.identifier,
    },
  });
  return did;
}

export async function getDids() {
  return await db.did.findMany();
}

export async function getDid(id: string) {
  return await db.did.findUnique({
    where: { id },
  });
}

export async function updateDid(id: string, data: Partial<DidDto>) {
  const did = await db.did.update({
    where: { id },
    data: {
      identifier: data.identifier,
    },
  });
  return did;
}

export async function deleteDid(id: string) {
  return await db.did.delete({
    where: { id },
  });
}
