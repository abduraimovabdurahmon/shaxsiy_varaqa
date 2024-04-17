try {
    const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

function generateDocument(data) {
  function replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce(function (error, key) {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  function errorHandler(error) {
    console.log(JSON.stringify({ error: error }, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors
        .map(function (error) {
          return error.properties.explanation;
        })
        .join("\n");
      console.log("errorMessages", errorMessages);
    }
    throw error;
  }

  var content = fs.readFileSync(
    path.resolve(__dirname, "input.docx"),
    "binary"
  );
  var zip = new PizZip(content);
  var doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    errorHandler(error);
  }

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    errorHandler(error);
  }

  var buf = doc.getZip().generate({ type: "nodebuffer" });

  fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

  return true; // Success
}

// var data = {
//     year_of_birth: '1990',
//     place_of_birth: 'Andijan',
//     nationality: 'American',
//     information: "school",
//     workplace: "UBTUIT",
//     parents_info: "palonchiyev palonchiyev",
//     marital_status: "single",
//     passport: "AA1234567",
//     parents_address: "Tashkent",
//     address: "Tashkent"
// };

// generateDocument(data);

const {
  Telegraf,
  session,
  Scenes: { BaseScene, Stage },
} = require("telegraf");


const BOT_TOKEN = "6549855302:AAEw6_ydTPT228HRVLMWWfOdhuzTv9vIBHg";
const bot = new Telegraf(BOT_TOKEN);
bot.use(session());


const year_of_birth_scene = new BaseScene("year_of_birth_scene");
year_of_birth_scene.enter((ctx) => ctx.reply("Tug'ilgan yilingizni kiriting: "));
year_of_birth_scene.on("text", (ctx) => {
  ctx.session.year_of_birth = ctx.message.text;
  ctx.scene.enter("place_of_birth_scene");
});

year_of_birth_scene.on("message", (ctx) => ctx.reply("Tug'ilgan yilingizni kiriting: "));

const place_of_birth_scene = new BaseScene("place_of_birth_scene");
place_of_birth_scene.enter((ctx) => ctx.reply("Tug'ilgan joyingizni kiriting (vilpyat, tuman, qishloq, mahalla, uy): "));
place_of_birth_scene.on("text", (ctx) => {
  ctx.session.place_of_birth = ctx.message.text;
  ctx.scene.enter("nationality_scene");
}
);

place_of_birth_scene.on("message", (ctx) => ctx.reply("Tug'ilgan joyingizni kiriting (vilpyat, tuman, qishloq, mahalla, uy): "));

const nationality_scene = new BaseScene("nationality_scene");
nationality_scene.enter((ctx) => ctx.reply("Millatingizni kiriting: (Masalan: O'zbek)"));
nationality_scene.on("text", (ctx) => {
  ctx.session.nationality = ctx.message.text;
  ctx.scene.enter("information_scene");
});

nationality_scene.on("message", (ctx) => ctx.reply("Millatingizni kiriting: (Masalan: O'zbek)"));

const information_scene = new BaseScene("information_scene");

information_scene.enter((ctx) => ctx.reply("Malumotingizni kiriting: (Masalan: Jarqo’rg’on tumani XTB ga qarashli 6-umumiy o’rta ta’lim maktabi"));
information_scene.on("text", (ctx) => {
  ctx.session.information = ctx.message.text;
  ctx.scene.enter("workplace_scene");
});

information_scene.on("message", (ctx) => ctx.reply("Malumotingizni kiriting: (Masalan: Jarqo’rg’on tumani XTB ga qarashli 6-umumiy o’rta ta’lim maktabi"));

const workplace_scene = new BaseScene("workplace_scene");
workplace_scene.enter((ctx) => ctx.reply("O’qishga kirgunga qadar ish joyi, mansabi (agar ishlagan bo’lsa), yoki yo'q deb yozib yuboring."));
workplace_scene.on("text", (ctx) => {
  ctx.session.workplace = ctx.message.text;
  ctx.scene.enter("parents_info_scene");
});

workplace_scene.on("message", (ctx) => ctx.reply("O’qishga kirgunga qadar ish joyi, mansabi (agar ishlagan bo’lsa), yoki yo'q deb yozib yuboring."));

const parents_info_scene = new BaseScene("parents_info_scene");
parents_info_scene.enter((ctx) => ctx.reply("Ota-onangiz haqida ma'lumotni yozing, (Ota-ona haqida ma’lumot(F.I.SH., qayerda, kim bo’lib ishlaydi, telefon raqami)"));
parents_info_scene.on("text", (ctx) => {
  ctx.session.parents_info = ctx.message.text;
  ctx.scene.enter("marital_status_scene");
});

parents_info_scene.on("message", (ctx) => ctx.reply("Ota-onangiz haqida ma'lumotni yozing, (Ota-ona haqida ma’lumot(F.I.SH., qayerda, kim bo’lib ishlaydi, telefon raqami)"));

const marital_status_scene = new BaseScene("marital_status_scene");
marital_status_scene.enter((ctx) => ctx.reply("Oilaviy axvoli (turmush o’rtog’ining   F.I.SH, qayerda kim bo’lib ishlashi) yoki turmush qurmagan deb yozing:"));
marital_status_scene.on("text", (ctx) => {
  ctx.session.marital_status = ctx.message.text;
  ctx.scene.enter("passport_scene");
});

marital_status_scene.on("message", (ctx) => ctx.reply("Oilaviy axvoli (turmush o’rtog’ining   F.I.SH, qayerda kim bo’lib ishlashi) yoki turmush qurmagan deb yozing:"));

const passport_scene = new BaseScene("passport_scene");
passport_scene.enter((ctx) => ctx.reply("Passport  seriyasi, raqami, kim tomonidan, qachon berilgan: "));
passport_scene.on("text", (ctx) => {
  ctx.session.passport = ctx.message.text;
  ctx.scene.enter("parents_address_scene");
});

passport_scene.on("message", (ctx) => ctx.reply("Passport  seriyasi, raqami, kim tomonidan, qachon berilgan: r"));

const parents_address_scene = new BaseScene("parents_address_scene");
parents_address_scene.enter((ctx) => ctx.reply("Ota-onaning manzili, telefon raqami"));
parents_address_scene.on("text", (ctx) => {
  ctx.session.parents_address = ctx.message.text;
  ctx.scene.enter("address_scene");
});

parents_address_scene.on("message", (ctx) => ctx.reply("Ota-onaning manzili, telefon raqami"));

const address_scene = new BaseScene("address_scene");
address_scene.enter((ctx) => ctx.reply("Uy manzili, shu jumladan ijara uy, talabalar turar joyi, telefoni"));
address_scene.on("text", async (ctx) => {
  ctx.session.address = ctx.message.text;
    ctx.scene.enter("generate_document_scene");
});

address_scene.on("message", (ctx) => ctx.reply("Uy manzili, shu jumladan ijara uy, talabalar turar joyi, telefoni"));

const generate_document_scene = new BaseScene("generate_document_scene");
generate_document_scene.enter(async(ctx) => {
    await generateDocument(ctx.session);
    ctx.telegram.sendDocument(1213637695, { source: path.resolve(__dirname, "output.docx")}, {reply_markup: {remove_keyboard: true}, caption: `${ctx.from.first_name} ${ctx.from.last_name?ctx.from.last_name:""}`, });
    ctx.reply("Sizning dokumentingiz tayyorlandi va yuborildi! Rahmat!");
    ctx.scene.leave();
});

const stage = new Stage([
  year_of_birth_scene,
  place_of_birth_scene,
  nationality_scene,
  information_scene,
  workplace_scene,
  parents_info_scene,
  marital_status_scene,
  passport_scene,
  parents_address_scene,
  address_scene,
  generate_document_scene
]);

bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter("year_of_birth_scene");
  console.log(ctx.from.id);
});

bot.launch();

} catch (error) {
    console.log(error)
}