const express = require('express')
require('dotenv').config();
const { Client } = require('@notionhq/client')

const app = express()

const notionSecret = process.env.NOTION_TOKEN
const notionDatabaseID = process.env.NOTION_DATABASE_ID

const notion = new Client({ auth: notionSecret })


const notionApi = async ( req, res) => {
    if (!notionSecret || !notionDatabaseID) throw new Error('Missing notion seret or DB_ID.')

    const query = await notion.databases.query({
        database_id: notionDatabaseID,
    })
    
    // @ts-ignore
    const rows = query.results.map((res) => res.properties)



    const RowData = rows.map(row => ({
        "id": 1,
        "date": "0309",
        "title": row.title.title[0].text.content,
        "tags": row.Tags.multi_select.map((tag) => tag.name),
        "content": row.schedule.rich_text[0].text.content.split('\n'),
        "startTime": row.startTime.rich_text[0].text.content,
        "icon": row.icon.rich_text[0].text.content
    }));
    
    
    res.status(200).json({ RowData })
}

app.get('/api/notion', notionApi);
app.listen(8000, () => {
    console.log("server run in 8000");
})

