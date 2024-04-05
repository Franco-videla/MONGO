import pymysql
import requests

# Establecer conexión con la base de datos
connection = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="root",
    database="tp2lab4"
)

cursor = connection.cursor()

for codigo in range(1, 301):
    url = f"https://restcountries.com/v2/callingcode/{codigo}"
    response = requests.get(url)
    
    if response.status_code == 200:
        country_data_list = response.json()
        
        if country_data_list:
            for country_data in country_data_list:
                nombre_pais = country_data.get("name") if country_data.get("name") else None
                capital_pais = country_data.get("capital") if country_data.get("capital") else None
                region = country_data.get("region") if country_data.get("region") else None
                poblacion = country_data.get("population") if country_data.get("population") else None
                latitud = country_data.get("latlng")[0] if country_data.get("latlng") else None
                longitud = country_data.get("latlng")[1] if country_data.get("latlng") else None
                codigo_pais = country_data.get("callingCodes")[0] if country_data.get("callingCodes") else None

                # Verificar si el país ya existe en la base de datos
                cursor.execute("SELECT * FROM Pais WHERE codigoPais = %s", (codigo_pais,))
                pais_existente = cursor.fetchone()

                if pais_existente:
                    # Actualizar la información del país
                    cursor.execute("UPDATE Pais SET nombrePais = %s, capitalPais = %s, region = %s, poblacion = %s, latitud = %s, longitud = %s WHERE codigoPais = %s", (nombre_pais, capital_pais, region, poblacion, latitud, longitud, codigo_pais))
                else:
                    # Insertar la información del país
                    cursor.execute("INSERT INTO Pais (codigoPais, nombrePais, capitalPais, region, poblacion, latitud, longitud) VALUES (%s, %s, %s, %s, %s, %s, %s)", (codigo_pais, nombre_pais, capital_pais, region, poblacion, latitud, longitud))

                connection.commit()
                
                # Verificar si la inserción o actualización fue exitosa
                if cursor.rowcount > 0:
                    print(f"Datos de país para código {codigo_pais} cargados correctamente.")
                else:
                    print(f"Error al cargar los datos de país para código {codigo_pais}.")
        else:
            print(f"No hay datos disponibles para el código {codigo}. Continuando con el siguiente código...")

# Cerrar la conexión con la base de datos
cursor.close()
connection.close()
print("Programa Finalizado")
