const Admin = require("./collection/admin");
const Event = require("./collection/event");
const Ticket = require("./collection/tickets");

const QRCode = require("qrcode");
const fs = require("fs");

function addAdmin(req, res) {
  const { email, password } = req.body;
  const admin = new Admin({ email, password });
  admin
    .save()
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
}

async function addEvent(req, res) {
  const { title, description, number } = req.body;
  const event = new Event({ title, description });
  let response;
  response = await event.save();
  console.log("response", response._id.toString());

  const folderName = `./output-file-path/${title}`;

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }

  for (let i = 0; i < number; i++) {
    const ticket = await addTicket(response._id);
    QRCode.toFile(
      `${folderName}/${ticket._id}.png`,
      ticket._id.toString(),
      {
        errorCorrectionLevel: "H",
      },
      function (err) {
        if (err) throw err;
        console.log("QR code saved!");
      }
    );
  }
  res.send(response);
}

async function addTicket(eventId) {
  const ticket = new Ticket({ eventId });
  return await ticket
    .save()
    .then((response) => response)
    .catch((error) => {
      throw new Error(error.message);
    });
}

async function useTicket(req, res) {
  const { ticketId } = req.body;
  console.log("ticketId", ticketId);
  const ticket = await Ticket.findByIdAndDelete(ticketId);
  res.send(ticket || null);
}

module.exports = { addAdmin, addEvent, addTicket, useTicket };
