const model = require('../models/model');

// POST: http://localhost:8080/api/categories
async function create_Categories(req, res) {
  try {
    const Create = new model.Categories({
      type: req.body.type || 'Savings',
      color: req.body.color || '#1F385C',
    });

    const savedCategory = await Create.save();
    return res.json(savedCategory);
  } catch (err) {
    return res.status(400).json({ message: `Error while creating categories: ${err}` });
  }
}

// GET: http://localhost:8080/api/categories
async function get_Categories(req, res) {
  try {
    let data = await model.Categories.find({});
    let filter = data.map(v => ({ type: v.type, color: v.color }));
    return res.json(filter);
  } catch (err) {
    return res.status(400).json({ message: `Error while fetching categories: ${err}` });
  }
}

// POST: http://localhost:8080/api/transaction
const create_Transaction = async (req, res) => {
  const { name, type, amount } = req.body;

  if (!name || !type || !amount) {
    return res.status(400).json({ message: "Post HTTP Data not Provided" });
  }

  try {
    const create = new model.Transaction({
      name,
      type,
      amount,
      date: new Date(),
    });

    await create.save();

    return res.status(201).json(create);
  } catch (err) {
    return res.status(500).json({ message: `Error while creating transaction: ${err.message}` });
  }
};

// GET: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
  try {
    let data = await model.Transaction.find({});
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: `Error while fetching transactions: ${err}` });
  }
}

// DELETE: http://localhost:8080/api/transaction
const delete_Transaction = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            console.log("Transaction ID not provided");
            return res.status(400).json({ message: "Transaction ID not provided" });
        }

        const result = await model.Transaction.deleteOne({ _id });

        if (result.deletedCount === 0) {
            console.log(`Transaction with ID ${_id} not found`);
            return res.status(404).json({ message: "Transaction not found" });
        }

        console.log(`Transaction with ID ${_id} deleted successfully`);
        return res.status(200).json({ message: "Record Deleted..." });
    } catch (err) {
        console.log(`Error while deleting transaction record: ${err.message}`);
        return res.status(500).json({ message: "Error while deleting transaction record", error: err.message });
    }
};

// labels : http://localhost:8080/api/labels
async function get_Labels(req, res) {
  try {
    const transactions = await model.Transaction.find({});
    const categories = await model.Categories.find({});
    
    console.log('Transactions:', transactions);
    console.log('Categories:', categories);

    const result = await model.Transaction.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "type",
          foreignField: "type",
          as: "categories_info",
        },
      },
      {
        $unwind: "$categories_info",
      },
    ]);

    if (result.length === 0) {
      console.log('No matching labels found. Ensure that the "type" fields match in both collections.');
    } else {
      console.log('Labels data:', result); // Log fetched data
    }
let data = result.map(v => Object.assign({},{_id:v._id,name:v.name,type:v.type,amount:v.amount,color:v.categories_info['color']}));
    res.json(data);
  } catch (error) {
    console.error('Error in get_Labels:', error.message);
    res.status(400).json({ message: `Lookup Collection Error: ${error.message}` });
  }
}

module.exports = {
  create_Categories,
  get_Categories,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels
};
