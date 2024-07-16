import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import img from '../../../assets/1720715543820.jpeg';

const generatePdf = async (includedPieces) => {

  console.log(includedPieces.description);
  // FUNÇÃO PARA ADICIONAR UMA NOVA PÁGINA SE FOR NECESSÁRIO

  // FUNÇÃO PARA CARREGAR UMA IMAGEM
  async function loadImage(url) {
    const imageBytes = await fetch(url).then(res => res.arrayBuffer());
    return imageBytes;
  }

  async function createPDF() {
    // CRIA O NOVO PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const item of includedPieces) {
      for (const image of item.imagesToSave) {
        const page = pdfDoc.addPage([595.28, 900]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        //var fontSize = 23;
        //var yPos = height - 120;

        // Carrega a imagem de plano de fundo
        const bgImageBytes = await loadImage(image);
        const bgImage = await pdfDoc.embedJpg(bgImageBytes);

        // OBTEM AS dimensões da página
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        // Desenha a imagem como plano de fundo
        page.drawImage(bgImage, {
          x: 0,
          y: page.getHeight() - height,
          width: page.getWidth(),
          height: page.getHeight(),
        });

        // Adiciona os textos com diferentes tamanhos e estilos
        const textX = 30;
        let textY = pageHeight - 80;

        // Texto da referência
        page.drawText(item.reference, {
          x: textX,
          y: textY,
          size: 18,
          font,
          color: rgb(0, 0, 0),
        });

        textY -= 20; // Move a posição Y para o próximo texto

        const sizesString = item.sizes.join(' - ');
        // Texto do tamanho
        page.drawText(sizesString, {
          x: textX,
          y: textY,
          size: 14,
          font,
          color: rgb(0, 0, 0),
        });

        textY -= 20;

        // Texto da cor
        page.drawText(item.description, {
          x: textX,
          y: textY,
          size: 14,
          font,
          color: rgb(0, 0, 0),
        });

        textY -= 20;

        // Texto do preço
        page.drawText(item.value, {
          x: textX,
          y: textY,
          size: 14,
          font,
          color: rgb(0, 0, 0),
        });
      }
    };

    // SALVA O PDF E FAZ O DOWNLOAD
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'catalog.pdf');
  }

  createPDF().catch(err => console.log(err));
};


export { generatePdf };
