import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function generateExpensesPdf(data: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on('error', reject);

    doc.fontSize(25).text('Relatório de Despesas', { align: 'center' });
    doc.moveDown();

    data.forEach(expense => {
      doc.fontSize(12).text(`Categoria: ${expense.categoria}`);
      doc.text(`Total: R$ ${expense.total.toFixed(2)}`);
      doc.text(`Percentual: ${expense.percentual.toFixed(2)}%`);
      doc.text(`Quantidade: ${expense.quantidade}`);
      doc.moveDown();
    });

    doc.end();
  });
}

