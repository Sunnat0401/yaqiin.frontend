'use client'

import { createProduct, deleteFile, updateProduct } from '@/actions/admin.action'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import useAction from '@/hooks/use-action'
import { useProduct } from '@/hooks/use-product'
import { toast } from '@/hooks/use-toast'
import { categories } from '@/lib/constants'
import { UploadDropzone } from '@/lib/uploadthing'
import { formatPrice } from '@/lib/utils'
import { productSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, PlusCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils' // cn funksiyasini chaqirish

const AddProduct = () => {
  const { isLoading, onError, setIsLoading } = useAction()
  const { open, setOpen, product, setProduct } = useProduct()

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      image: '',
      imageKey: '',
    },
  })

  async function onSubmit(values: z.infer<typeof productSchema>) {
    if (!form.watch('image')) {
      return toast({
        description: 'Please upload an image',
        variant: 'destructive',
      })
    }

    setIsLoading(true)
    let res

    try {
      if (product?._id) {
        res = await updateProduct({ ...values, id: product._id })
      } else {
        res = await createProduct(values)
      }

      if (res?.serverError || res?.validationErrors || !res?.data) {
        return onError('Something went wrong')
      }
      if (res.data.failure) {
        return onError(res.data.failure)
      }

      const successMessage = product?._id ? 'Product updated successfully' : 'Product created successfully'

      toast({ description: successMessage })
      setOpen(false)
      form.reset()
    } catch (error) {
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  function onOpen() {
    setOpen(true)
    form.reset({
      title: '',
      description: '',
      category: '',
      price: '',
      image: '',
      imageKey: '',
    })
    setProduct(null)
  }

  async function onDeleteImage() {
    try {
      await deleteFile(form.getValues('imageKey'))
      form.setValue('image', '')
      form.setValue('imageKey', '')
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to delete image',
      })
    }
  }

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        price: product.price.toString(),
      })
    }
  }, [product])

  return (
    <>
      <Button
        onClick={onOpen}
        className={cn(
          'w-[200px] h-[42px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 max-[500px]:w-[50px] ml-auto max-[400px]:w-[50px]',
          'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
          'text-white font-semibold text-base rounded-2xl',
          'shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40',
          'transition-all duration-300 ease-out',
          'hover:scale-[1.02] active:scale-[0.98]',
          'border-0 relative overflow-hidden',
          'justify-end ml-auto max-[500px]:w-[100px] justify-center'
        )}
      >
        <PlusCircle size={24} className="mr-2 max-[500px]:m-auto" />
        <span className="text-white font-semibold max-[500px]:hidden" >Add Product</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full xs:max-w-md overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle className="text-lg xs:text-xl">
              {product?._id ? 'Edit Product' : 'Add New Product'}
            </SheetTitle>
            <SheetDescription className="text-xs xs:text-sm">
              Fields marked with <span className="text-red-500">*</span> are required
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-3" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-xs xs:text-sm">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="e.g. Adidas Running Shoes"
                        className="bg-secondary h-9 xs:h-10 text-xs xs:text-sm"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-xs xs:text-sm">Description</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product..."
                        disabled={isLoading}
                        className="bg-secondary text-xs xs:text-sm min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-xs xs:text-sm">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary h-9 xs:h-10 text-xs xs:text-sm">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="text-xs xs:text-sm">
                        {categories.slice(1).map((category) => (
                          <SelectItem value={category} key={category} className="text-xs xs:text-sm">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Label className="text-xs xs:text-sm">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-secondary h-9 xs:h-10 text-xs xs:text-sm pl-8"
                          disabled={isLoading}
                          {...field}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs xs:text-sm text-muted-foreground">
                          UZS
                        </span>
                      </div>
                    </FormControl>
                    {field.value && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(Number(field.value))}
                      </p>
                    )}
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-1">
                <Label className="text-xs xs:text-sm">
                  Product Image <span className="text-red-500">*</span>
                </Label>
                {form.watch('image') ? (
                  <div className="relative w-full h-[150px] xs:h-[180px] bg-secondary rounded-md overflow-hidden">
                    <Image
                      src={form.watch('image')}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7"
                      type="button"
                      onClick={onDeleteImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      form.setValue('image', res[0].url)
                      form.setValue('imageKey', res[0].key)
                    }}
                    config={{ appendOnPaste: true, mode: 'auto' }}
                    appearance={{
                      container: {
                        height: '150px',
                        padding: '0.5rem',
                        borderWidth: '1px',
                        borderRadius: '0.375rem',
                      },
                      label: {
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      },
                      button: {
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                      },
                    }}
                  />
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-10 mt-4" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : product?._id ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AddProduct