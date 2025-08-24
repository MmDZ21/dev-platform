-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "activeTheme" TEXT NOT NULL,
    "defaultLocale" TEXT NOT NULL,
    "supportedLocales" TEXT[],
    "directionByLocale" JSONB NOT NULL,
    "baseUrl" TEXT,
    "themeSettings" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "path" VARCHAR(512) NOT NULL,
    "locale" TEXT NOT NULL,
    "layoutKey" TEXT NOT NULL DEFAULT 'default',
    "slots" JSONB NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_locale_idx" ON "Page"("locale");

-- CreateIndex
CREATE INDEX "Page_path_idx" ON "Page"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Page_locale_path_key" ON "Page"("locale", "path");
