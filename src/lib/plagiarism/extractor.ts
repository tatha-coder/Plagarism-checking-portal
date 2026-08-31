import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedDocumentData {
  text: string;
  wordCount: number;
  charCount: number;
  sentenceCount: number;
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: 'pdf' | 'docx' | 'txt' | 'raw',
  filename?: string
): Promise<ExtractedDocumentData> {
  let text = '';

  const ext = filename ? filename.split('.').pop()?.toLowerCase() : fileType;

  try {
    if (ext === 'pdf' || fileType === 'pdf') {
      const data = await pdfParse(buffer);
      text = data.text || '';
    } else if (ext === 'docx' || fileType === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || '';
    } else {
      // txt, raw text, markdown, etc.
      text = buffer.toString('utf-8');
    }
  } catch (err: any) {
    console.error(`Error extracting text from ${fileType}:`, err);
    // Fallback: try raw utf-8 string if it contains readable characters
    text = buffer.toString('utf-8').replace(/[^\x20-\x7E\t\r\n]/g, ' ');
  }

  // Normalize line endings and extra spaces
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return {
    text,
    wordCount: words.length,
    charCount: text.length,
    sentenceCount: sentences.length,
  };
}
