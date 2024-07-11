import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import img from '../../../assets/ModelosStreet.png';
import imgPiece from '../../../assets/silk e devore.png';


const generatePdf = async () => {

  // CRIA O NOVO PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 900]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  var fontSize = 23;
  var yPos = height - 120;

  // FUNÇÃO PARA ADICIONAR UMA NOVA PÁGINA SE FOR NECESSÁRIO
  const addNewPageIfNeeded = () => {
    if (yPos < 20) {
      yPos = height - 50;
      return pdfDoc.addPage([595.28, 900]);
    }
    return null;
  };

  // ADIÇÃO DA PRIMEIRA IMAGEM
  var url = img;
  var imageBytes = await fetch(url).then(res => res.arrayBuffer());
  var image = await pdfDoc.embedPng(imageBytes);
  var imageDims = image.scale(0.4);
  page.drawImage(image, {
    x: (width - imageDims.width) / 2,
    y: yPos,
    width: imageDims.width,
    height: imageDims.height,
  });

  yPos -= 30;
  addNewPageIfNeeded();

  // ADIÇÃO DO TEXTO DE GRADE
  var dispText = 'Grade do 38 ao 46';
  var textWidth = font.widthOfTextAtSize(dispText, fontSize);
  var textX = (width - textWidth) / 2;
  page.drawText(dispText, {
    x: textX,
    y: yPos,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  yPos -= 350;
  addNewPageIfNeeded();

  // ADIÇÃO DA PRIMEIRA FOTO DA PEÇA
  url = imgPiece;
  imageBytes = await fetch(url).then(res => res.arrayBuffer());
  image = await pdfDoc.embedPng(imageBytes);
  imageDims = image.scale(0.9);
  page.drawImage(image, {
    x: width - imageDims.width - 100,
    y: yPos,
    width: imageDims.width,
    height: imageDims.height,
  });

  yPos -= 330;
  addNewPageIfNeeded();

  // ADIÇÃO DA SEGUNDA IMAGEM DA PEÇA
  page.drawImage(image, {
    x: 100,
    y: yPos,
    width: imageDims.width,
    height: imageDims.height,
  });

  yPos += 320;
  addNewPageIfNeeded();

  // ADIÇÃO DA DESCRIÇÃO DO BACKGROUND DA DESCRIÇÃO
  fontSize = 20;
  dispText = 'Calça com silk CODI e devorê';
  textWidth = font.widthOfTextAtSize(dispText, fontSize);
  textX = (width - textWidth) / 2;
  page.drawRectangle({
    x: 115,
    y: yPos - 6,
    width: 370,
    height: fontSize + 5,
    color: rgb(0.725, 0.1, 0.1),
  });

  // ADIÇÃO DA DESCRIÇÃO DA PEÇA
  page.drawText(dispText, {
    x: textX,
    y: yPos,
    size: fontSize,
    color: rgb(1, 1, 1),
  });

  // SALVA O PDF E FAZ O DOWNLOAD
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'catalog.pdf');
};


export { generatePdf };
