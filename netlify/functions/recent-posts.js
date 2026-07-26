const NOTION_ENDPOINT = 'https://api.notion.com/v1/databases/3a90b2bb0186804d98e0ce4123d534fe/query';
const NOTION_TOKEN = process.env.NOTION_API_TOKEN || process.env.NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        Allow: 'POST',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!NOTION_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Notion API token' }),
    };
  }

  try {
    const notionResponse = await fetch(NOTION_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 5 }),
    });

    if (!notionResponse.ok) {
      const errorBody = await notionResponse.text();
      return {
        statusCode: notionResponse.status,
        body: JSON.stringify({ error: 'Notion API error', details: errorBody }),
      };
    }

    const data = await notionResponse.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch Notion data', details: error.message }),
    };
  }
};
