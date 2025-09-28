import React, { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Product } from '@/types/product'
import { JEELIZVTOWIDGET } from '@/dista/jeelizVTOWidget.module.js' // adjust path

interface VirtualTryOnProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, isOpen, onClose }) => {
  const refPlaceHolder = useRef<HTMLDivElement>(null)
  const refCanvas = useRef<HTMLCanvasElement>(null)
  const refLoading = useRef<HTMLDivElement>(null)

  

  // Load predefined Jeeliz glasses based on product.frame_type.name
  const loadProductModel = () => {
    if (!product || !product.sku) return

    const sku = product.sku
    JEELIZVTOWIDGET.load(sku, {
      pivotOffset: [0.0, 0.05, 0.0],
      scale: 1.2,
      successCallback: () => {
        console.log(`✅ Loaded Jeeliz model: ${sku}`)
       
      },
      errorCallback: (err: any) => {
        console.error('❌ Failed to load Jeeliz model', err)
      
      },
    })
  }

  // Take a snapshot and download as PNG
  const downloadSnapshot = () => {
    if (!refCanvas.current) return
    const canvas = refCanvas.current
    const link = document.createElement('a')
    link.download = `${product.name || 'glasses'}_tryon.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Initialize the Jeeliz widget
  useEffect(() => {
    if (!isOpen || !refPlaceHolder.current || !refCanvas.current) return

    JEELIZVTOWIDGET.start({
      placeHolder: refPlaceHolder.current,
      canvas: refCanvas.current,
      sku: 'empty', // initial empty
      searchImageMask: 'https://appstatic.jeeliz.com/jeewidget/images/target.png',
      searchImageColor: 0xeeeeee,
      searchImageRotationSpeed: -0.001,
      callbackReady: () => {
        console.log('INFO: JEELIZVTOWIDGET is ready :)')
        setTimeout(() => loadProductModel(), 500) // small delay to ensure widget ready
      },
      onError: (err) => {
        console.error('Jeeliz error:', err)
      },
    })

    // Cleanup on unmount
    return () => {
      JEELIZVTOWIDGET.destroy()
    }
  }, [isOpen, product])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Virtual Try-On - {product.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              JEELIZVTOWIDGET.destroy() // stop webcam
              onClose()
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <div
            ref={refPlaceHolder}
            className="JeelizVTOWidget relative bg-black rounded-lg overflow-hidden flex items-center justify-center"
            style={{ height: 480 }}
          >
            <canvas ref={refCanvas} className="JeelizVTOWidgetCanvas"></canvas>

           
          </div>

          {/* Download button */}
          <div className="mt-4 flex justify-center">
            <Button onClick={downloadSnapshot}>Download Snapshot</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VirtualTryOn
