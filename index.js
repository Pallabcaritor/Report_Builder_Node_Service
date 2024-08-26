// Entry Point of the API Server 

const express = require('express');

/* Creates an Express application. 
The express() function is a top-level 
function exported by the express module.
*/
const app = express();
const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'asics',
	host: 'localhost',
	database: 'asics_live',
	password: 'password',
	dialect: 'postgres',
	port: 5432
});


/* To handle the HTTP Methods Body Parser 
is used, Generally used to extract the 
entire body portion of an incoming 
request stream and exposes it on req.body 
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


pool.connect((err, client, release) => {
	if (err) {
		return console.error(
			'Error acquiring client', err.stack)
	}
	client.query('SELECT NOW()', (err, result) => {
		release()
		if (err) {
			return console.error(
				'Error executing query', err.stack)
		}
		console.log("Connected to Database !")
	})
})

app.get('/getseasons', (req, res, next) => {    
    // getting query from queries
    var constants = require('./queries');
    
	pool.query(constants.SEASON_QUERY)
		.then(testData => {
			// console.log(testData);
			res.send(testData.rows);
		})
})

app.get('/getorderwindow', (req, res, next) => {    
    // getting request param
    const season = req.query;
    //console.log(`Season is ${season.season}`);
	//console.log(`Param value is ----> ${typeof season}`)
    //console.log(`Type of ----> ${typeof season.season}`)

    var constants = require('./queries');

    if (season.season != undefined)
		{
			if (season.season.length == 0)
			{
				pool.query(constants.ORDER_WINDOW_QUERY)
				.then(testData => {
					res.send(testData.rows);
				})
			}
			else if(season.season.length != 0)
			  {
                const seasonValue = season.season
				const query = (constants.ORDER_WINDOW_IN_QUERY).replace('{seasonValue}', seasonValue)
				console.log(`Final query getOrderWindow----> ${query}`)
				pool.query(query)
				.then(testData => {
					res.send(testData.rows);
				})
			  }
		}
	
	else if (season.season == undefined)
	{
		pool.query(constants.ORDER_WINDOW_QUERY)
		.then(testData => {
			res.send(testData.rows);
		})
	}

    else
        {
			pool.query(constants.ORDER_WINDOW_QUERY)
			.then(testData => {
				res.send(testData.rows);
			})
        }
	//res.status(200).send('Ok-Ok');
	
})

app.get('/owindowlabel', (req, res, next) => {    
    // getting request param
    const params = req.query;
    var constants = require('./queries');

    if (params.season == undefined & params.order_window == undefined)
	{
			pool.query(constants.ORDER_WINDOW_LABEL_QUERY1)
			.then(testData => {
				res.send(testData.rows);
			})
	}
	
	else if (params.season != undefined & params.order_window != undefined)

		if (params.season.length != 0 & params.order_window.length != 0)
		{
			const seasonValue = params.season
			const owindowValue = params.order_window

			const query = (constants.ORDER_WINDOW_LABEL_QUERY2).replace('{seasonValue}', seasonValue).replace('{owindowValue}', owindowValue)
			console.log(`Final query get--Order--Window--Label----> ${query}`)
			pool.query(query)
			.then(testData => {
				res.send(testData.rows);
			})
		}

		else if (params.season.length == 0 & params.order_window.length == 0)
		{
			pool.query(constants.ORDER_WINDOW_LABEL_QUERY1)
			.then(testData => {
				res.send(testData.rows);
			})

		}

		else if (params.season.length != 0 & params.order_window.length == 0)
			{
				const seasonValue = params.season
                
				const query = (constants.ORDER_WINDOW_LABEL_QUERY3).replace('{seasonValue}', seasonValue)
				console.log(`Final query get--Order--Window--Label----> ${query}`)
				pool.query(query)
				.then(testData => {
					res.send(testData.rows);
				})
	
			}
		
		else if (params.season.length == 0 & params.order_window.length != 0)
			{
				const owindowValue = params.order_window
				
				const query = (constants.ORDER_WINDOW_LABEL_QUERY4).replace('{owindowValue}', owindowValue)
				console.log(`Final query get--Order--Window--Label----> ${query}`)
				pool.query(query)
				.then(testData => {
					res.send(testData.rows);
				})
	
			}
		
		else 
			{
				pool.query(constants.ORDER_WINDOW_LABEL_QUERY1)
				.then(testData => {
					res.send(testData.rows);
				})
	
			}
    else
        {
			pool.query(constants.ORDER_WINDOW_LABEL_QUERY1)
			.then(testData => {
				res.send(testData.rows);
			})
        }	
})

app.get('/getfilter2', (req, res, next) => {    
    // getting request param
    const params = req.query;
    var constants = require('./queries');

    if (params.season != undefined)
	{
		if (params.season.length == 0)
		{
			res.status(400).send('No Season Selected');
		}
		else
		{
			seasonValue = params.season
		}
	}

	else if (params.season == undefined)
	{
		res.status(400).send('Invalid Season!');
	}
	
	else
	{
		res.status(400).send('Invalid Operation!');
	}

	

	if (params.order_window != undefined)
	{
		orderwindowValue = params.order_window
	}
    

	if (params.windowlabel != undefined)
	{
		windowlabelValue2 = params.windowlabel
		var wl = windowlabelValue2.split(",");
        windowlabelValue = "'" + wl.join("','") + "'";
	}



	if (params.attribute != undefined)
	{
		if (params.attribute.length == 0)
			{
				res.status(400).send('No Attribute Selected');
			}
			else
			{
		        attributeValue = params.attribute
			}
	}
	else if (params.attribute == undefined)
	{
		res.status(400).send('Invalid Attribute!');
	}
	else
	{
		res.status(400).send('Invalid Attribute!');
	}
    
	if (params.order_window != undefined & params.windowlabel != undefined)
	{
		if (attributeValue.toUpperCase() == 'CUSTOMER')
		{				
			query = (constants.FILTER2_CUSTOMER).replace('{orderwindowValue}', orderwindowValue).replace('{orderwindowValue}', orderwindowValue).replace('{seasonValue}', seasonValue).replace('{windowlabelValue}', windowlabelValue)
		}

		else if (attributeValue.toUpperCase() == 'CUSTOMER_STORE')
		{				
			query = (constants.FILTER2_CUSTOMER_STORE).replace('{orderwindowValue}', orderwindowValue).replace('{orderwindowValue}', orderwindowValue).replace('{seasonValue}', seasonValue).replace('{windowlabelValue}', windowlabelValue)
		}

		else if (attributeValue.toUpperCase() == 'SUBSIDIARY')
		{				
			query = (constants.FILTER2_SUBSIDIARY)
		}
		else 
		{				
			query = (constants.FILTER2_GEN).replace('{attributeValue}',attributeValue).replace('{orderwindowValue}', orderwindowValue).replace('{orderwindowValue}', orderwindowValue).replace('{seasonValue}', seasonValue).replace('{windowlabelValue}', windowlabelValue).replace('{attributeValue}',attributeValue)
		}

		console.log(`Filter2 query----------> ${query}`)
		pool.query(query)
		.then(testData => {
			res.send(testData.rows);
		})
	}

	if (params.order_window == undefined & params.windowlabel == undefined)
		{
			if (attributeValue.toUpperCase() == 'CUSTOMER')
			{				
				query = (`SELECT distinct tf.franchise_name FROM t_franchise tf, t_order tod  where tf.id = tod.franchise_id and (tod.season_id in ({seasonValue})) ORDER BY tf.franchise_name`).replace('{seasonValue}')
			}
	
			else if (attributeValue.toUpperCase() == 'CUSTOMER_STORE')
			{				
				query = (constants.FILTER2_CUSTOMER_STORE2).replace('{seasonValue}', seasonValue)
			}
	
			else if (attributeValue.toUpperCase() == 'SUBSIDIARY')
			{				
				query = (constants.FILTER2_SUBSIDIARY)
			}

			else 
			{				
				query = (constants.FILTER2_GEN2).replace('{attributeValue}',attributeValue).replace('{seasonValue}', seasonValue).replace('{attributeValue}',attributeValue)
			}
	
			console.log(`Filter2 query----------> ${query}`)
			pool.query(query)
			.then(testData => {
				res.send(testData.rows);
			})
		}

		if (params.order_window != undefined & params.windowlabel == undefined)
			{
				if (attributeValue.toUpperCase() == 'CUSTOMER')
				{				
					query = (constants.FILTER2_CUSTOMER2).replace('{orderwindowValue}',orderwindowValue).replace('{orderwindowValue}',orderwindowValue).replace('{seasonValue}',seasonValue)
				}
		
				else if (attributeValue.toUpperCase() == 'CUSTOMER_STORE')
				{				
					query = (constants.FILTER2_CUSTOMER_STORE3).replace('{orderwindowValue}',orderwindowValue).replace('{orderwindowValue}',orderwindowValue).replace('{seasonValue}',seasonValue)
				}
		
				else if (attributeValue.toUpperCase() == 'SUBSIDIARY')
				{				
					query = (constants.FILTER2_SUBSIDIARY)
				}
				else 
				{				
					query = (constants.FILTER2_GEN3).replace('{attributeValue}',attributeValue).replace('{orderwindowValue}', orderwindowValue).replace('{orderwindowValue}', orderwindowValue).replace('{seasonValue}', seasonValue).replace('{attributeValue}',attributeValue)
				}
		
				console.log(`Filter2 query----------> ${query}`)
				pool.query(query)
				.then(testData => {
					res.send(testData.rows);
				})
			}

	// console.log(`Season Value is----> ${seasonValue}`)
	// console.log(`Attribute Value is----> ${attributeValue}`)
	// res.status(200).send('Ok-Ok');
	
})

// Require the Routes API 
// Create a Server and run it on the port 3000
const server = app.listen(3000, function () {
	let host = server.address().address
	let port = server.address().port
	// Starting the Server at the port 3000
})
