declare module 'html2pdf.js' {
  interface Html2PdfImageOptions {
    type: 'jpeg' | 'png' | 'webp';
    quality: number;
  }

  interface Html2PdfHtml2CanvasOptions {
    scale: number;
    useCORS: boolean;
    logging: boolean;
  }

  interface Html2PdfJsPDFOptions {
    unit: string;
    format: string;
    orientation: string;
    compress: boolean;
  }

  interface Html2PdfPageBreakOptions {
    mode: string[];
  }

  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: Html2PdfImageOptions;
    html2canvas?: Html2PdfHtml2CanvasOptions;
    jsPDF?: Html2PdfJsPDFOptions;
    pagebreak?: Html2PdfPageBreakOptions;
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement): Html2Pdf;
    save(): void;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}