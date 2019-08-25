import axios from 'axios';
import cheerio from 'cheerio';

export class PriconneDataCrawler {

    public async getData(): Promise<any> {

        let characters = await this.getCharacters();
        // console.log(characters);
        return characters;
    }

    private async getCharacters(): Promise<string[]> {
        const response = await axios.get('http://priconne.inven.co.kr/dataninfo/character/');
        const $ = cheerio.load(response.data, {
            ignoreWhitespace: true,
            lowerCaseAttributeNames: true,
            lowerCaseTags: true,
        });
        const $rows = $('#listTable tbody tr');
        $rows.each((idx, elm) => {
            const $row = $(elm);
            const name: string = $row.find('.name a').text();
            const link: string = $row.find('a.charaDetailLink').attr('href');
            const type: string = $row.find('.name .ndata').text() == '1' ? '물리' : '마법';
            const voice: string = $row.find('.charaVoice').text().replace('CV : ', '');
            const iconRaw: string = $row.find('.charaImage img').attr('src');
            const icon = iconRaw;
            const image = icon
                .replace('icon_unit', 'thumb_unit_profile')
                .replace('.png', '.jpg');
            console.log({
                name,
                link, type, voice, icon, image
            });
        });
        const $links = $('#listTable tr a.charaDetailLink');
        return $links.toArray().map(elm => {
            return $(elm).attr('href')
        });
    }
}