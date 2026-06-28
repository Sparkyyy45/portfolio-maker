export async function extractTextFromPdf(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    // Dynamically import pdfjs-dist only in the browser to prevent SSR build errors (DOMMatrix missing in Node)
    const pdfjs = await import('pdfjs-dist');
    
    // Set up the worker source dynamically
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.370/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse resume PDF. Please verify it is a valid text-based PDF.');
  }
}
