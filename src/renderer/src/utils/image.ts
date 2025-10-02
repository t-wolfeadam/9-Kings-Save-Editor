// Import all images using Vite's glob import
const imageModules = import.meta.glob('../assets/*.png', { eager: true, as: 'url' })

// Function to dynamically load image path
export const im = (imagePath: string): string => {
    // Convert relative path to the key format used by glob
    const normalizedPath = imagePath.startsWith('./') ? imagePath.slice(2) : imagePath
    const key = `../assets/${normalizedPath.split('/').pop()}`
    
    const imageUrl = imageModules[key]
    if (!imageUrl) {
        console.warn(`Image not found: ${imagePath}`)
        return ''
    }
    
    return imageUrl as string
}