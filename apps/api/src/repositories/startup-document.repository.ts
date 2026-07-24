import { prisma } from "../lib/db.js";

export async function create(data: {
  applicationId: number;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  category?: string;
}) {
  return prisma.startupDocument.create({ data });
}

export async function findByApplication(applicationId: number) {
  return prisma.startupDocument.findMany({
    where: { applicationId },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function findById(id: number) {
  return prisma.startupDocument.findUnique({ where: { id } });
}

export async function deleteById(id: number) {
  return prisma.startupDocument.delete({ where: { id } });
}

export async function getFilePathsByApplication(applicationId: number): Promise<string[]> {
  const docs = await prisma.startupDocument.findMany({
    where: { applicationId },
    select: { filePath: true },
  });
  return docs.map((d) => d.filePath);
}