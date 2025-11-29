-- CreateTable
CREATE TABLE "Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "classroom" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "professor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ScheduleToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ScheduleToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ScheduleToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScheduleToSubject_AB_unique" ON "_ScheduleToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_ScheduleToSubject_B_index" ON "_ScheduleToSubject"("B");
