/*
  Warnings:

  - The values [Fí] on the enum `Patient_sex` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Patient` MODIFY `sex` ENUM('M', 'F') NOT NULL;
