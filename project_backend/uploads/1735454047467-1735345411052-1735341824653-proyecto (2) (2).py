import cv2
import os

# Función principal
def detectar_bordes(imagen_entrada, imagen_salida, umbral1, umbral2):
    """
    Detecta bordes en una imagen usando el algoritmo de Canny.
    
    Args:
        imagen_entrada (str): Ruta de la imagen de entrada.
        imagen_salida (str): Ruta donde se guardará la imagen procesada.
        umbral1 (int): Primer umbral para la detección de bordes.
        umbral2 (int): Segundo umbral para la detección de bordes.
    """
    # Verificar si la imagen existe
    if not os.path.exists(imagen_entrada):
        print(f"La imagen {imagen_entrada} no existe.")
        return
    
    # Cargar la imagen
    imagen = cv2.imread(imagen_entrada)
    if imagen is None:
        print("Error al cargar la imagen.")
        return
    
    # Convertir la imagen a escala de grises
    gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    
    # Aplicar desenfoque para reducir ruido
    desenfoque = cv2.GaussianBlur(gris, (5, 5), 0)
    
    # Aplicar el detector de bordes de Canny
    bordes = cv2.Canny(desenfoque, umbral1, umbral2)
    
    # Guardar la imagen procesada
    cv2.imwrite(imagen_salida, bordes)
    
    # Mostrar la imagen original y la procesada
    cv2.imshow("Imagen Original", imagen)
    cv2.imshow("Bordes Detectados", bordes)
    
    # Esperar a que el usuario presione una tecla y cerrar ventanas
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Ejecución del programa
if __name__ == "__main__":
    # Rutas de las imágenes
    imagen_entrada = "imagen.jpg"  # Reemplaza con la ruta de tu imagen
    imagen_salida = "bordes_detectados.jpg"

    # Umbrales para la detección de bordes
    umbral1 = 100
    umbral2 = 200

    # Llamar a la función para detectar bordes
    detectar_bordes(imagen_entrada, imagen_salida, umbral1, umbral2)
