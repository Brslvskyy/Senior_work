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
  const mainFolderPath = "./output-file-path";

  try {
    if (!fs.existsSync(mainFolderPath)) {
      fs.mkdirSync(mainFolderPath);
    }
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

async function useEvent(req, res) {
  const { eventId } = req.query;
  console.log("eventId", eventId);
  if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
    const event = await Event.findById(eventId).catch((err) =>
      console.log(err.message)
    );

    if (event) return res.send(event._id);
  }
  return res.send(false);
}

async function useTicket(req, res) {
  const { ticketId, eventId } = req.body;
  console.log("ticketId", ticketId);
  const event = await Event.findById(eventId).catch((err) =>
    console.log(err.message)
  );
  if (event) {
    const ticket = await Ticket.findOneAndDelete({
      _id: ticketId,
      eventId: eventId,
    }).catch((err) => {
      console.log("error when searching for ticket");
      console.warn(err.message);
    });
    if (ticket) {
      const folderName = `./output-file-path/${event?.title}/${ticket._id}.png`;
      fs.rmSync(folderName);
    }
    res.send(ticket || null);
  } else {
    res.send(null);
  }
}

module.exports = { addAdmin, addEvent, addTicket, useTicket, useEvent };
