const { getInfoFromAdvertisement } = require('./routes');
const { insertIntoCarConditionTable } = require('./sqlQuery');

async function formatAdvertiseId(data) {
  const idWithLinks = [...data];
  idWithLinks.forEach(
    (x) =>
      (x.advertise_id = x.advertise_id.split(':')[1].replace(')', '').trim())
  );

  return idWithLinks;
}

async function formatText(numberOfCars) {
  const fullText = await getInfoFromAdvertisement(numberOfCars);
  fullText.forEach((feature) => {
    feature.condition = feature.condition.replace(/\n/g, '');
    feature.condition = feature.condition.replace('HIRDETÉS', '');
    feature.condition = feature.condition.replace(
      'Finanszírozás kalkulátor',
      ''
    );
    feature.condition = feature.condition.replace(
      'Akció feltételei:Érdeklődjön az akció pontos feltételeiről!',
      ''
    );
    feature.condition = feature.condition.replaceAll('á', 'a');
    feature.condition = feature.condition.replaceAll('ű', 'u');
    feature.condition = feature.condition.replaceAll('ú', 'u');
    feature.condition = feature.condition.replaceAll('Ú', 'U');
    feature.condition = feature.condition.replaceAll('ő', 'o');
  });

  return fullText;
}

async function getCarCondition(numberOfCars) {
  const allCondition = await formatText(numberOfCars);

  const myRegex1 = /Évjarat:\d+\/\d|Évjarat:\d+/;
  const myRegex2 = /Állapot:\w+|űnő/;
  const myRegex3 = /Kivitel:\w+[A-Z]|Kivitel:\w+/;
  const myRegex4 = /allas:\d/;

  const conditionPerCar = [];

  allCondition.forEach((condition) => {
    const releaseYear = condition.condition
      .match(myRegex1)[0]
      .replace('Évjarat:', '');
    const carCondition = condition.condition
      .match(myRegex2)[0]
      .replace('Állapot:', '')
      .replace('Kivitel', '');
    let type = condition.condition
      .match(myRegex3)[0]
      .replace('Km', '')
      .replace('Kivitel', '')
      .replace(':', '');
    let km = '';
    if (condition.condition.match(myRegex4) !== null) {
      km = condition.condition.match(myRegex4)[0].replace('allas:', '');
    }

    if (type[type.length - 1] === 'J') {
      type = type.replace(`${type[type.length - 1]}`, '');
    }

    conditionPerCar.push({
      condition: {
        releaseYear: releaseYear,
        carCondition: carCondition,
        type: type,
        km: km,
        normalPrice: condition.normalPrice,
        priceWithExtras: condition.priceWithExtras,
      },
    });
  });

  return conditionPerCar;
}

module.exports = { formatAdvertiseId, formatText, getCarCondition };
