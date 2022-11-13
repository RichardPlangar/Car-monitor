const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { getLinksFromDatabase } = require('./sqlQuery');
const app = express();
//const url = `https://www.hasznaltauto.hu/talalatilista/PCOG2VG3R3RDADH5S56ACFHGWKM4OXNBIFNKDEKWTLL4VABJUFEYZEVUDJAPZ6Z2NWA2JYVJ22YR2H47TQKOI7BCF5PE4CZJNIEFREKTWDBFM7BQG2K4FH6RUA7ECE5IQPTFFAGOBNLYZP2LWGTFMBIMUEDWE34LAE23RURIDN5SOUUIOEDH5UWMRMKNROBS5NNT2S6EW3KUAZYP7ZWEDB7SADHDJXJZKJGLX343CQKTRMA3AVNPSJYFIVOBANGZE44Z5OKGQ55I7AM6UR7UTQP4ZB3TXF5XGEES3ZNWJTL3PMDFQLRGGLJHLGDBM4AIOC4HLMAEHPPI224XLN5EQODAREKCS6ETQH3XJ2A3DV6KJRSLCUXR3R7XGGG57XXND2JLE4U7MTYB7OSWNXIGPET65VHY53FX3LRMBJXAYGN4MBZSP6KQ6X4OBQCUK5VZ5XJ26XOX65ZDLCBUXGE2J7GC6U64UVQLUUB3VO3FBS4BUSRVDQIRLJJNNJ6UPOBEVBR6GD5II4DMFFTPARBK5SY5JR2KSVLUUUPIUWE2DU5TTBG2RROZTJJSLMZK7BS7AHMBGVHXONAWWOASTMO6JC54VD7HEO3PFA463YZCYZCR7T3CHTV6G6MM4564Z53U4VQMN2VBVXIDKLUMRHS3T7GB6AE6YIVKJN3LDAOHSKGUNDYZZJF3BCQ2ZWM6USE2VMXJ3QHRMUNQREG6DMLZH57HTLWV7J7YNO6E5WVJT7WJEGKFRV2YRFXQEWWDKZCNOGDG5WFTK2G6BAHGDBTWPJ3VJ4ZDV4S4SM63K2MOSVAH6HARNXE5FHQ4KUU75VX7ML4E3JRILO7NNSTEVPDH6BCPIN5UEX7OZBK2ATOC6PNIXTGW7ZBZXRVAJXEF57YDADD2LSI/page${page}`;

async function getLink(url, page) {
  const linksWithIds = [];
  if (page > 1) {
    url += '/page' + page;
  }

  try {
    const response = await axios.get(url, { responseEncoding: 'binary' });
    const html = response.data;
    const loadedPage = cheerio.load(html.toString('ISO-8859-1'), {
      decodeEntities: false,
    });

    loadedPage('.talalatisor-adatok', html).each(function () {
      const car_name = loadedPage(this).find('a').text();
      const advertise_id = loadedPage(this).find('.talalatisor-hirkod').text();
      const link = loadedPage(this).find('a').attr('href');
      if (link && link.includes('szemelyauto')) {
        linksWithIds.push({ advertise_id, link, car_name });
      }
    });

    loadedPage('.garancialis', html).each(function () {
      const link = loadedPage(this).find('.col-sm-20 h3 a').attr('href');
      const car_name = loadedPage(this).find('a').text();
      const advertise_id = loadedPage(this).find('.talalatisor-hirkod').text();
      linksWithIds.push({ advertise_id, link, car_name });
    });

    loadedPage('.kiemelt', html).each(function () {
      const link = loadedPage(this).find('.col-sm-20 h3 a').attr('href');
      const car_name = loadedPage(this).find('a').text();
      const advertise_id = loadedPage(this).find('.talalatisor-hirkod').text();
      linksWithIds.push({ link, car_name, advertise_id });
    });

    return linksWithIds;
  } catch (e) {
    console.log('error:', e);
  }
}

async function getInfoFromAdvertisement(numberOfCars) {
  const allLinks = await getLinksFromDatabase(numberOfCars);

  let allFeatureOfCar = [];

  for await (let link of allLinks) {
    const url = link.link;
    try {
      const response = await axios.get(url);
      const html = response.data;
      const loadedPage = cheerio.load(html.toString('ISO-8859-1'), {
        decodeEntities: false,
      });
      loadedPage('.hirdetesadatok', html).each(async function () {
        let price = loadedPage(this).find('tr:nth-child(2)').text();
        let priceWithExtras = price.split('Ft')[0];
        let normalPrice = price.split('Ft')[1];
        if (price.includes('Vételár') || price.includes('Alaptípus')) {
          normalPrice = price;
          priceWithExtras = null;
        }
        const condition = loadedPage(this).find('tr td').text();
        allFeatureOfCar.push({ condition, normalPrice, priceWithExtras });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return allFeatureOfCar;
}

module.exports = { app, getLink, getInfoFromAdvertisement };
