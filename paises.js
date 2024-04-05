const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function migrateData() {
    try {
       
            // Conectar al servidor de MongoDB si no está conectado
            await client.connect();
        
        const db = client.db('paises_db');

        for (let codigo = 1; codigo <= 300; codigo++) {
            const url = `https://restcountries.com/v2/callingcode/${codigo}`;
            const response = await fetch(url);
            const countryDataList = await response.json();

            if (countryDataList.length > 0) {
                for (let countryData of countryDataList) {
                    const nombrePais = countryData.name || null;
                    const capitalPais = countryData.capital || null;
                    const region = countryData.region || null;
                    const poblacion = countryData.population || null;
                    const latitud = countryData.latlng ? countryData.latlng[0] : null;
                    const longitud = countryData.latlng ? countryData.latlng[1] : null;
                    const codigoPais = countryData.callingCodes ? countryData.callingCodes[0] : null;

                    // Buscar el país en la colección
                    const existingCountry = await db.collection('paises').findOne({ codigoPais });

                    if (existingCountry) {
                        // Actualizar la información del país
                        await db.collection('paises').updateOne(
                            { codigoPais },
                            {
                                $set: {
                                    nombrePais,
                                    capitalPais,
                                    region,
                                    poblacion,
                                    latitud,
                                    longitud
                                }
                            }
                        );
                    } else {
                        // Insertar la información del país
                        await db.collection('paises').insertOne({
                            codigoPais,
                            nombrePais,
                            capitalPais,
                            region,
                            poblacion,
                            latitud,
                            longitud
                        });
                    }
                }
            }
        }

        console.log('Proceso de migración completado');
    } catch (error) {
        console.error('Error durante la migración de datos:', error);
    } finally {
        await client.close();
    }
}

migrateData();


async function regionAmerica() {
    try {

            await client.connect();
            const db = client.db('paises_db');

            // Buscar los países con región "Americas"
            const countriesInAmericas = await db.collection('paises').find({ region: 'Americas' }).toArray();

            // Mostrar los resultados por consola
            console.log('Países en la región Americas:');
            console.log(countriesInAmericas);
        
           
        
    } catch (error) {
        console.error('Error al seleccionar países por región:', error);
    } finally {
        // Cerrar la conexión solo si estaba abierta

            await client.close();
        }
    }

// Llamar a la función para seleccionar países por región
//regionAmerica();

async function americaMax(region, populationThreshold) {
    try {

            // Conectar al servidor de MongoDB si no está conectado
            await client.connect();

        // Seleccionar la base de datos y la colección
        const db = client.db('paises_db');
        const collection = db.collection('paises');


        const countriesInAmericas = await db.collection('paises').find({ region: 'Americas' }).toArray();

        
        // Construir la consulta con la región y la población
        const query = { region: region, poblacion: { $gt: populationThreshold } };
       // const result = await collection.find(query).toArray();
  
        // Mostrar el resultado por consola
        console.log('Países en la región', region, 'con población mayor a', populationThreshold, ':');
   
        result = await collection.find(query).toArray();

        console.log('Países en la región', region, 'con población mayor a', populationThreshold, ':', result);
        
        
    } catch (error) {
        console.error('Error al buscar países por región y población:', error);
    }
}

//americaMax('Americas', 10000000);

async function RegionSinAfrica() {
    try {
        
            await client.connect();
       

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar documentos donde la región no sea "Africa"
        const query = { region: { $ne: 'Africa' } };
        const result = await collection.find(query).toArray();

        console.log('Países cuya región no es Africa:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar países por región:', error);
    }
}

//RegionSinAfrica();
async function ActualizacionEgito() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar el documento a actualizar
        const filter = { nombrePais: 'Egypt' };

        // Definir las actualizaciones que deseas realizar
        const updateDoc = {
            $set: {
                nombrePais: 'Egipto',
                poblacion: 95000000
            }
        };

        // Ejecutar la actualización del documento
        const result = await collection.updateOne(filter, updateDoc);

        console.log('Resultado de la actualización:');
        console.log(result);

        // Buscar y mostrar el documento actualizado
        const updatedDocument = await collection.findOne({ nombrePais: 'Egipto' });
        console.log('Documento actualizado:');
        console.log(updatedDocument);

        return updatedDocument;
    } catch (error) {
        console.error('Error al actualizar el país y mostrar el cambio:', error);
    
    }
}

//ActualizacionEgito();
async function Eliminar258(code) {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar el documento a eliminar
        const filter = { codigoPais: code };
        console.log(filter);
        // Ejecutar la eliminación del documento
        const result = await collection.deleteOne(filter);

        console.log('Resultado de la eliminación:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al eliminar el país:', error);
    } 
}

//Eliminar258("258");

//5.6
//Cuando se ejecuta el método drop() sobre una colección en MongoDB, se elimina completamente esa colección y todos sus documentos.
//Esto incluye cualquier índice o configuración asociada con la colección. Es importante tener en cuenta que esta operación es irreversible y borrará todos los datos de la colección de manera permanente.
//Por lo tanto, se debe tener extrema precaución al usar el método drop().
//Por otro lado, al ejecutar el método drop() sobre una base de datos en MongoDB, se elimina la base de datos completa, incluyendo todas las colecciones, índices y configuraciones asociadas.
//Esto es aún más drástico que eliminar solo una colección,ya que afecta a toda la base de datos y todos sus datos. 
//Al igual que con drop() en colecciones, esta operación es irreversible y eliminará todos los datos de la base de datos de manera permanente.

async function poblacionDist() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');
        // Construir la consulta para seleccionar los documentos por población
        const query = { poblacion: { $gt: 50000000, $lt: 150000000 } };
        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query).toArray();
        // Mostrar el resultado por consola
        console.log('Países con población entre 50,000,000 y 150,000,000:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar países por población:', error);
    } 
}

//poblacionDist();

async function nombreAscendente() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar los documentos y ordenarlos por nombre ascendente
        const query = {};
        const options = { sort: { nombrePais: 1 } }; // 1 para ascendente, -1 para descendente

        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query, options).toArray();

        // Mostrar el resultado por consola
        console.log('Países ordenados por nombre de forma ascendente:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar y ordenar países por nombre:', error);
    } 
}
//nombreAscendente();


//El método skip() en MongoDB se utiliza para omitir un número específico de documentos en una colección y obtener los documentos restantes a partir de ese punto. 
//Esto es útil cuando se necesita paginar resultados o cuando se desea ignorar una cantidad determinada de documentos al realizar consultas.
//Por ejemplo, si tenemos una colección de países y queremos obtener los países ordenados por nombre, pero omitiendo los primeros 5 países, podemos utilizar skip(5) para lograrlo.
//Esto significa que MongoDB omitirá los primeros 5 documentos y nos devolverá los documentos restantes a partir del sexto.
async function skip() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para obtener países, omitiendo los primeros 5
        const query = {};
        //const options = { sort: { codigoPais: 1 }, skip: 5 }; // Omitir los primeros 5 países
        const options = { skip: 5 };
        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query, options).toArray();

        // Mostrar el resultado por consola
        console.log('Países después de omitir los primeros 5:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al omitir países:', error);
    } 
}

//skip();


//5.10
//En MongoDB, las expresiones regulares se utilizan para buscar patrones en los datos, similar al uso de LIKE en SQL. 
//Por ejemplo, para buscar todos los países cuyo nombre comienza con "United", usaríamos una expresión regular /^United/ en MongoDB, mientras que en SQL sería LIKE 'United%'.
//Las expresiones regulares en MongoDB ofrecen más flexibilidad y potencia para realizar búsquedas complejas.

async function createIndex() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Crear un nuevo índice en el campo codigoPais
        await collection.createIndex({ codigoPais: 1 }, { name: "codigoPais_index" });

        console.log('Índice creado correctamente.');
    } catch (error) {
        console.error('Error al crear el índice:', error);
    } 
}

//createIndex();


//5.12
//Para realizar un backup de la base de datos MongoDB países_db, puedes usar el comando mongodump en la línea de comandos. Por ejemplo:
//mongodump --db países_db --out /ruta/del/respaldo