$// index.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/news', async (req, res) => {
  const query = req.query.query || '뉴스';
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=10`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-Naver-Client-Id': 'Hy2WeEoOS65nNW1KGJTq',
        'X-Naver-Client-Secret': 'aIxMu1fRS6'
      }
    });

    const items = response.data.items;
    console.log(' 받은 뉴스 수:', items.length);
    res.json({ items });
  } catch (error) {
    console.error(' 뉴스 API 오류:', error.message);
    res.status(500).send('뉴스 가져오기 실패');
  }
});

app.get('/article', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const content =
      $('#dic_area').text() || $('.news_end').text() || $('article').text() || '본문을 찾을 수 없습니다.';

    res.json({ content: content.trim() });
  } catch (error) {
    res.status(500).send('본문 크롤링 실패');
  }
});

app.listen(PORT, () => {
  console.log(` 서버 실행 중: http://localhost:${PORT}`);
});