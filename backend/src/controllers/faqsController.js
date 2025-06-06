import FaqsModel from "../models/faqs.js";

const faqsController = {};
/********************** S E L E C T **************************/

faqsController.getFaqs = async (req, res) => {
  try {
    const faqs = await FaqsModel.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.log("error" + error);
    res.status(400).json({ message: "Internal Error" });
  }
};

/********************** I N S E R T **************************/

faqsController.insertFaqs = async (req, res) => {
  try {
    //1-Pido las cosas
    const { question, answer, level, isActive } = req.body;

    if (level < 1 || level > 5) {
      return res.status(400).json({ message: "Ingrese nivel valido" });
    }

    //Validación de campos vacios
    if (!question || !answer || !level || !isActive) {
      return res.status(400).json({ message: "Ingrese los datos solicitados" });
    }

    //Validacion de longitud
    if (question.length < 4 || answer.length < 4) {
      return res.status(400).json({ message: "Ingrese mas letras" });
    }

    //2- Guardar las cosas en la base de datos
    const newFaqs = new FaqsModel({ question, answer, level, isActive });
    await newFaqs.save();
    //3-
    res.json({ messaje: "The faqs has been save " });
  } catch (error) {}
};

/********************** D E L E T E **************************/

faqsController.deleteFaqs = async (req, res) => {
  try {
    await FaqsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "The faqs has been delete" });
  } catch (error) {
    
  }
};

/********************** U P D A T E **************************/

faqsController.updateFaqs = async (req, res) => {
  const { question, answer, level, isActive } = req.body;
  const updatedFaqs = await FaqsModel.findByIdAndUpdate(
    req.params.id,
    { question, answer, level, isActive },
    { new: true }
  );
  res.json({ message: "The faqs has been update" });
};

export default faqsController;
