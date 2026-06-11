// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
// @ts-ignore
import mammoth from "mammoth/mammoth.browser.min.js";

// Vite and Chrome Extension worker workaround for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.mjs');

export async function parseFileToText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return await parsePDF(file);
  } else if (extension === 'docx') {
    return await parseWord(file);
  } else {
    throw new Error('不支持的文件格式，目前仅支持 .pdf 和 .docx');
  }
}

async function parseWord(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (err) {
        reject(new Error("Word 文件解析失败: " + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsArrayBuffer(file);
  });
}

async function parsePDF(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }
      resolve(fullText.trim());
    } catch (err) {
      reject(new Error("PDF 文件解析失败: " + (err as Error).message));
    }
  });
}
