"""
Procesamiento de imágenes digitales
Transformaciones
Ayala Elizalde Oscar
Badillo Peres José Antonio
21/09/2024
"""

# Librerías
from colorama import Fore, Style
import cv2
import numpy as np
import os


# Función de conversión binaria
def binaria(imagen_copia):
    # Transformación en escala de grises
    imagen_copia = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)

    # Crear matriz vacía para guardar la nueva información
    matriz_binaria = np.zeros_like(imagen_copia)

    # Recorrer la matriz
    for i in range(imagen_copia.shape[0]):
        for j in range(imagen_copia.shape[1]):
            # Comparar con umbral para aplicar blanco
            if imagen_copia[i, j] > 127:
                matriz_binaria[i, j] = 255

            # Aplicar negro
            else:
                matriz_binaria[i, j] = 0

    # Mostrar la imagen
    cv2.imshow("Imagen binaria", matriz_binaria)
    print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
    print("Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    os.system("clear")


# Función de transformación gama
def gama(imagen_copia):
    # Normalizar imagen
    matriz_normalizada = imagen_copia / 255

    # Aplicar transformación gama
    imagen_gama = np.power(matriz_normalizada, 2.2)

    # Escalar la imagen de vuelta al rango [0, 255] y convertir a uint8
    imagen_gama = (imagen_gama * 255).astype(np.uint8)

    # Mostrar la imagen
    cv2.imshow("Imagen gama", imagen_gama)
    print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
    print("Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    os.system("clear")


# Función de conversión a escala de grises
def grises(imagen_copia):
    # Crear matriz vacía para guardar la nueva información
    matriz_binaria = np.zeros_like(imagen_copia)

    # Recorrer la matriz
    for i in range(imagen_copia.shape[0]):
        for j in range(imagen_copia.shape[1]):
            # Asignar los valores de la matriz a las variables
            azul, verde, rojo = imagen_copia[i, j]

            # Aplicación de fórmula para generar la escala de grises
            gris = 0.299 * rojo + 0.587 * verde + 0.114 * azul
            # Asignar los nuevos valores a una matriz
            matriz_binaria[i, j] = int(gris)

    # Mostrar la imagen
    cv2.imshow("Imagen en escala de grises", matriz_binaria)
    print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
    print("Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    os.system("clear")


# Función de transformación logarítmica
def logaritmica(imagen_copia):
    # Calcular media globar para determinar umbral C
    media_global = np.mean(imagen_copia)

    # Separar los canales de color
    B, G, R = cv2.split(imagen_copia)

    # Convertir a float para evitar overflow
    B = np.float32(B)
    G = np.float32(G)
    R = np.float32(R)

    # Aplicar logaritmo a cada canal
    B_log = media_global * np.log(1 + B)
    G_log = media_global * np.log(1 + G)
    R_log = media_global * np.log(1 + R)

    # Normalizar los canales
    B_log = cv2.normalize(B_log, None, 0, 255, cv2.NORM_MINMAX)
    G_log = cv2.normalize(G_log, None, 0, 255, cv2.NORM_MINMAX)
    R_log = cv2.normalize(R_log, None, 0, 255, cv2.NORM_MINMAX)

    # Convertir de nuevo a uint8
    B_log = np.uint8(B_log)
    G_log = np.uint8(G_log)
    R_log = np.uint8(R_log)

    # Combinar canales de color
    imagen_log = cv2.merge([B_log, G_log, R_log])

    print(f"La media global es: {media_global}")
    print(f"La matriz es así:\n{imagen_log}")

    # Mostrar la imagen
    cv2.imshow("Imagen logarítmica", imagen_log)
    print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
    print("Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    os.system("clear")


# Función para conversión negativa
def negativa(imagen_copia):
    # Crear matriz vacía para guardar la imagen negativa
    matriz_binaria = 255 - imagen_copia

    print(f"La matriz es así:\n{matriz_binaria}")
    # Mostrar la imagen
    cv2.imshow("Imagen negativa", matriz_binaria)
    print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
    print("Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    os.system("clear")


# Función de menú principal
def menu(imagen):
    # Crear copia con nuevas dimensiones
    dimensiones = (800, 600)
    imagen_copia = cv2.resize(imagen, dimensiones)

    # Monstrar opciones de transformación
    while True:
        print(Fore.YELLOW + "\n======= " + Style.RESET_ALL, end="")
        print("Opciones de transformaciones" + Fore.YELLOW + " =======")
        print(Style.RESET_ALL)
        print("1. Binaria\t2. Gama\t\t3. Gray\n4. Negativa\t5. Logaritmica\t6. Salir")
        opcion = int(
            input(Fore.GREEN + "\n[+] " + Style.RESET_ALL + "Ingrese una opción: ")
        )

        # Control de selección de opciones
        if opcion == 1:
            # Llamada a función de transformación binaria
            binaria(imagen_copia)

        elif opcion == 2:
            # Llamada a función de transformación gama
            gama(imagen_copia)

        elif opcion == 3:
            print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
            print("Procesando imagen...")

            # Llamada a función de transformación a escala de grises
            grises(imagen_copia)

        elif opcion == 4:
            # Llamada a función de transformación negativa
            negativa(imagen_copia)

        elif opcion == 5:
            # Llamada a función de transformación logarítmica
            logaritmica(imagen_copia)

        elif opcion == 6:
            print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
            print("Cerrando programa...")
            os.system("sleep 1")
            break

        else:
            print(Fore.RED + "\n[x] " + Style.RESET_ALL, end="")
            print("Opción no válida")
            os.system("sleep 2 && clear")


# Inicio de programa
if __name__ == "_main_":

    os.system("clear")
    print(Fore.CYAN + "\n================================")
    print("|" + Style.RESET_ALL, end="")
    print(" Transformaciones de imágenes ", end="")
    print(Fore.CYAN + "|")
    print("================================\n" + Style.RESET_ALL)

    # Cargar imagen
    nombre_imagen = "atardecer-bosque.jpg"
    imagen = cv2.imread(nombre_imagen)

    # Confirmar la correcta lectura de la imagen
    if imagen is None:
        raise ValueError("[x] Error al cargar la imagen")

    else:
        print(Fore.YELLOW + "[!] " + Style.RESET_ALL, end="")
        print(f"Leyendo imagen: {nombre_imagen}")
        os.system("sleep 1")
        print(Fore.GREEN + "[+] " + Style.RESET_ALL, end="")
        print("Imagen cargada correctamente\n")

        # Visualizar imagen original
        opcion = input(
            Fore.GREEN
            + "[+] "
            + Style.RESET_ALL
            + "¿Desea ver la imagen origianl?(s/n): "
        )

        if opcion.lower() == "s":

            # Mostrar la imagen
            imagen_menor = cv2.resize(imagen, (800, 600))
            cv2.imshow("Imagen original", imagen_menor)
            print(Fore.YELLOW + "\n[!] " + Style.RESET_ALL, end="")
            print("Presione 'q' en la ventana de imagen para cerrarla")

            # Mantener la ventana abierta
            while True:
                key = cv2.waitKey(1) & 0xFF
                if key == ord("q"):
                    break

            cv2.destroyAllWindows()

        os.system("clear")

        # Llamar a función de menú
        menu(imagen)