#!/usr/bin/python3

"""
Procesamiento de imágenes digitales
Transformaciones
Ayala Elizalde Oscar
Badillo Peres José Antonio
Flores Cortés Brenda Andrea
11/10/2024
"""

# Librerías
from tkinter import messagebox
import cv2
import numpy as np
import os
import tkinter as tk


import cv2
import numpy as np
import numpy as np
import cv2

def edges(imagen_copia, ventana_proceso, tamanno):
    # Convertir imagen a escala de grises
    imagen_copia = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)

    # Crear matrices vacías para almacenar los resultados
    sobel_x = np.zeros_like(imagen_copia, dtype=np.float32)
    sobel_y = np.zeros_like(imagen_copia, dtype=np.float32)

    # Selección del kernel y su tamaño
    if tamanno == 3:
        kernel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
        kernel_y = np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]], dtype=np.float32)
    elif tamanno == 5:
        kernel_x = np.array([[-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2]], dtype=np.float32)
        kernel_y = kernel_x.T
    elif tamanno == 7:
        kernel_x = np.array([[-3, -2, -1, 0, 1, 2, 3]] * 7, dtype=np.float32)
        kernel_y = kernel_x.T
    else:
        raise ValueError("Tamaño de kernel no soportado. Use 3, 5 o 7.")
    
    # Calcular el offset
    offset = tamanno // 2

    # Mostrar ventana emergente de "Procesando imagen"
    ventana_proceso.deiconify()
    ventana_proceso.update_idletasks()

    # Recorrido de la imagen para aplicar el filtro Sobel
    filas, columnas = imagen_copia.shape
    for i in range(offset, filas - offset):
        for j in range(offset, columnas - offset):
            # Extraer la región correspondiente al tamaño del kernel
            region = imagen_copia[i - offset:i + offset + 1, j - offset:j + offset + 1]
            # Aplicar convolución para Sobel en x y en y
            sobel_x[i, j] = np.sum(region * kernel_x)
            sobel_y[i, j] = np.sum(region * kernel_y)

    # Calcular el gradiente
    sobel_img = np.sqrt(sobel_x ** 2 + sobel_y ** 2)

    # Normalizar la imagen a rango [0, 255]
    sobel_img = cv2.normalize(sobel_img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    # Ocultar la ventana de "Procesando"
    ventana_proceso.withdraw()

    # Mostrar la imagen resultante
    cv2.imshow("Filtro Sobel", sobel_img)
    print("\n[!] Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta hasta que se presione 'q'
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    # Cerrar la ventana de imagen
    cv2.destroyAllWindows()


# Función para crear un kernel gaussiano
def crear_kernel_gaussiano(tamanno, sigma):
    k = tamanno // 2
    x = np.linspace(-k, k, tamanno)
    y = np.linspace(-k, k, tamanno)
    x, y = np.meshgrid(x, y)
    
    kernel = (1 / (2 * np.pi * sigma ** 2)) * np.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))

    # Normalizar el kernel
    kernel /= np.sum(kernel) 
    
    return kernel

# Función para aplicar el filtro gaussiano
def gausiano(imagen_copia, ventana_proceso, tamanno):
    # Convertir imagen a escala de grises
    imagen_copia = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)

    # Definir sigma según el tamaño del kernel
    if tamanno == 3:
        sigma = 1
    elif tamanno == 5:
        sigma = 1.5
    elif tamanno == 7:
        sigma = 2
    else:
        sigma = 1

    # Crear el kernel gaussiano con el tamaño especificado
    kernel = crear_kernel_gaussiano(tamanno, sigma)

    # Obtener dimensiones de la imagen y del kernel
    altura, ancho = imagen_copia.shape
    k_height, k_width = kernel.shape

    # Calcular relleno
    pad_h = k_height // 2
    pad_w = k_width // 2

    # Rellenar la imagen con ceros
    imagen_padded = np.pad(imagen_copia, ((pad_h, pad_h), (pad_w, pad_w)), mode='constant')

    # Crear una imagen de salida
    imagen_filtrada = np.zeros_like(imagen_copia)

    # Mostrar ventana emergente de "Procesando imagen"
    ventana_proceso.deiconify()
    ventana_proceso.update_idletasks()

    # Aplicar la convolución
    for i in range(altura):
        for j in range(ancho):
            region = imagen_padded[i:i + k_height, j:j + k_width]
            imagen_filtrada[i, j] = np.sum(region * kernel)

    # Ocultar la ventana de "Procesando"
    ventana_proceso.withdraw()

    # Mostrar la imagen
    cv2.imshow("Filtro Gaussiano", imagen_filtrada)
    print("\n[!] Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    cv2.destroyAllWindows()


#Filtro de mediana
def mediana(imagen_copia, ventana_proceso, tamanno):
    imagen_gray = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)  # Convertir a escala de grises si es necesario

    # Mostrar ventana emergente de "Procesando imagen"
    ventana_proceso.deiconify()
    ventana_proceso.update_idletasks()

    # Especificar el tamaño del kernel
    tamaño_kernel = tamanno  # Debe ser un número impar
    offset = tamaño_kernel // 2

    # Obtener las dimensiones de la imagen
    alto, ancho = imagen_gray.shape

    # Crear una imagen para almacenar el resultado
    imagen_filtrada = np.zeros_like(imagen_gray)

    # Aplicar el filtro de mediana
    for i in range(offset, alto - offset):
        for j in range(offset, ancho - offset):
            # Extraer el kernel
            kernel = imagen_gray[i - offset:i + offset + 1, j - offset:j + offset + 1]
            
            # Calcular la mediana y asignar el valor al píxel correspondiente
            imagen_filtrada[i, j] = np.median(kernel)

    # Convertir a uint8 (opcional, dependiendo de la imagen original)
    imagen_filtrada = imagen_filtrada.astype(np.uint8)
    
    # Ocultar la ventana de "Procesando" después del procesamiento
    ventana_proceso.withdraw()
    
    cv2.imshow('Imagen Filtrada', imagen_filtrada)
    print("\n[!] Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    # Cerrar ventana
    cv2.destroyAllWindows()


# Función para filtro sharpening
def sharpening(imagen_copia, ventana_proceso, tamanno):
    # Convertir imagen a escala de grises
    imagen_copia = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)

    # Crear copia de matriz
    imagen_sharp = np.zeros_like(imagen_copia)

    # Definir el kernel de sharpening según el tamaño seleccionado
    if tamanno == 3:
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        offset = 1

    elif tamanno == 5:
        kernel = np.array([[0, 0, -1, 0, 0],
                           [0, -1, -2, -1, 0],
                           [-1, -2, 16, -2, -1],
                           [0, -1, -2, -1, 0],
                           [0, 0, -1, 0, 0]])
        offset = 2

    elif tamanno == 7:
        kernel = np.array([[0, 0, -1, -1, -1, 0, 0],
                           [0, -1, -3, -3, -3, -1, 0],
                           [-1, -3, 0, 7, 0, -3, -1],
                           [-1, -3, 7, 24, 7, -3, -1],
                           [-1, -3, 0, 7, 0, -3, -1],
                           [0, -1, -3, -3, -3, -1, 0],
                           [0, 0, -1, -1, -1, 0, 0]])
        offset = 3

    # Dimensiones de imagen
    filas, columnas = imagen_copia.shape

    # Mostrar ventana emergente de "Procesando imagen"
    ventana_proceso.deiconify()
    ventana_proceso.update_idletasks()

    # Recorrido manual para aplicar el filtro (convolución)
    for i in range(offset, filas - offset):
        for j in range(offset, columnas - offset):
            # Extraer la región correspondiente al tamaño del kernel
            region = imagen_copia[i - offset:i + offset + 1, j - offset:j + offset + 1]
            # Aplicar la convolución manual
            nuevo_valor = np.sum(region * kernel)
            # Asignar el nuevo valor (asegurarse de que esté en el rango 0-255)
            imagen_sharp[i, j] = np.clip(nuevo_valor, 0, 255)

    # Ocultar la ventana de "Procesando"
    ventana_proceso.withdraw()

    # Mostrar la imagen
    cv2.imshow("Filtro Sharpening", imagen_sharp)
    print("\n[!] Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    # Cerrar ventana
    cv2.destroyAllWindows()


# Función para filtro Sobel
def sobel(imagen_copia, ventana_proceso, tamanno):
    # Convertir imagen a escala de grises
    imagen_copia = cv2.cvtColor(imagen_copia, cv2.COLOR_BGR2GRAY)

    # Crear matrices vacías para almacenar los resultados
    sobel_x = np.zeros_like(imagen_copia, dtype=np.float32)
    sobel_y = np.zeros_like(imagen_copia, dtype=np.float32)

    # Selección del kernel y su tamaño
    if tamanno == 3:
        kernel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
        kernel_y = np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]], dtype=np.float32)
    elif tamanno == 5:
        kernel_x = np.array([[-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2], [-2, -1, 0, 1, 2]], dtype=np.float32)
        kernel_y = kernel_x.T
    elif tamanno == 7:
        kernel_x = np.array([[-3, -2, -1, 0, 1, 2, 3]] * 7, dtype=np.float32)
        kernel_y = kernel_x.T
    else:
        raise ValueError("Tamaño de kernel no soportado. Use 3, 5 o 7.")
    
    # Calcular el offset
    offset = tamanno // 2

    # Mostrar ventana emergente de "Procesando imagen"
    ventana_proceso.deiconify()
    ventana_proceso.update_idletasks()

    # Dimensiones de la imagen
    filas, columnas = imagen_copia.shape
    for i in range(offset, filas - offset):
        for j in range(offset, columnas - offset):
            # Extraer la región correspondiente al tamaño del kernel
            region = imagen_copia[i - offset:i + offset + 1, j - offset:j + offset + 1]
            # Aplicar convolución para Sobel en x y en y
            sobel_x[i, j] = np.sum(region * kernel_x)
            sobel_y[i, j] = np.sum(region * kernel_y)

    # Calcular el gradiente
    sobel_img = np.sqrt(sobel_x ** 2 + sobel_y ** 2)

    # Normalizar la imagen a rango [0, 255]
    sobel_img = cv2.normalize(sobel_img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    # Ocultar la ventana de "Procesando" después del procesamiento
    ventana_proceso.withdraw()

    # Mostrar la imagen resultante
    cv2.imshow("Filtro Sobel", sobel_img)
    print("\n[!] Presione 'q' en la ventana de imagen para cerrarla")

    # Mantener la ventana abierta hasta que se presione 'q'
    while True:
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

    # Cerrar la ventana de imagen
    cv2.destroyAllWindows()

######################################
# Función de menú principal
def aplicar_filtro(filtro, imagen, root, tamanno):
    # Crear una nueva ventana para mostrar el mensaje de procesamiento
    ventana_proceso = tk.Toplevel(root)
    ventana_proceso.title("Alerta")
    ventana_proceso.geometry("300x100")
    tk.Label(ventana_proceso, text="Procesando imagen...", padx=20, pady=20).pack()
    ventana_proceso.update()

    # Crear copia con nuevas dimensiones
    dimensiones = (800, 600)
    imagen_copia = cv2.resize(imagen, dimensiones)

    # Mostrar opciones de transformación
    if filtro == "edges":
        edges(imagen_copia, ventana_proceso, tamanno)

    elif filtro == "sobel":
        sobel(imagen_copia, ventana_proceso, tamanno)

    elif filtro == "mediana":
        mediana(imagen_copia, ventana_proceso, tamanno)

    elif filtro == "sharpening":
        sharpening(imagen_copia, ventana_proceso, tamanno)

    elif filtro == "gausiano":
        gausiano(imagen_copia, ventana_proceso, tamanno)


######################################
# Función principal
def iniciar_aplicacion():
    root = tk.Tk()
    root.title("Filtros de imágenes")
    root.geometry("400x250")

    # Iniciar proceso
    imagen = cv2.imread("Templo.png")

    # Opción de tamaño del kernel usando un slider
    tk.Label(root, text="Seleccione tamaño del kernel:").place(x=100, y=120)
    tamanno = tk.Scale(root, from_=3, to=7, resolution=2, orient=tk.HORIZONTAL)
    tamanno.place(x=140, y=140)
    tamanno.set(3)

    # Edges
    btn_edge = tk.Button(root, text="Edges", command=lambda: aplicar_filtro("edges", imagen, root, tamanno.get()))
    btn_edge.place(x=40, y=70)

    # Sharpenin1g
    btn_sobel = tk.Button(root, text="Sharpening", command=lambda: aplicar_filtro("sharpening", imagen, root, tamanno.get()))
    btn_sobel.place(x=140, y=20)

    # Sobel
    btn_sobel = tk.Button(root, text="Sobel", command=lambda: aplicar_filtro("sobel", imagen, root, tamanno.get()))
    btn_sobel.place(x=40, y=20)

    # Mediana
    btn_sobel = tk.Button(root, text="Mediana", command=lambda: aplicar_filtro("mediana", imagen, root, tamanno.get()))
    btn_sobel.place(x=140, y=70)

    # Gausiano
    btn_gausiano = tk.Button(root, text="Gausiano", command=lambda: aplicar_filtro("gausiano", imagen, root, tamanno.get()))
    btn_gausiano.place(x=270, y=20)

    # Botón para salir
    btn_salir = tk.Button(root, text="Salir", command=root.quit)
    btn_salir.place(x=165, y=200)

    root.mainloop()

######################################
# Inicio de programa
if __name__ == "__main__":
    iniciar_aplicacion()
