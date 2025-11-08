/**
 * Test script to verify PDF loading works correctly
 * Run with: npx tsx scripts/test-pdf-loader.ts
 */

import { loadPdfFromPath } from "../lib/pdf-loader";
import path from "path";

async function testPdfLoader() {
    console.log("🧪 Testing PDF Loader...\n");

    try {
        // You can test with any PDF file - update this path
        const testPdfPath = path.join(__dirname, "../test-sample.pdf");

        console.log(`📄 Loading PDF from: ${testPdfPath}`);

        const result = await loadPdfFromPath(testPdfPath);

        console.log("\n✅ PDF loaded successfully!");
        console.log(`📊 Total Pages: ${result.metadata.totalPages}`);
        console.log(`📝 Content Length: ${result.content.length} characters`);
        console.log(`📄 Pages Count: ${result.pages.length}`);

        console.log("\n--- First 500 characters ---");
        console.log(result.content.substring(0, 500));

        console.log("\n✅ Test completed successfully!");
    } catch (error) {
        console.error("\n❌ Test failed:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Stack:", error.stack);
        }
    }
}

testPdfLoader();
