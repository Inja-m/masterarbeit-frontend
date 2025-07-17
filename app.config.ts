export default defineAppConfig({
  ui: {	
		button:{
			defaultVariants: {
        size: 'lg'
			}
		},
		switch:{
			defaultVariants: {
        size: 'lg'
			}
		},
		checkbox:{
			defaultVariants: {
        size: 'lg'
			}
		},
		textarea:{
			defaultVariants: {
        size: 'lg'
			},
		},
		input:{
			defaultVariants: {
        size: 'lg'
			}
		},
		select:{
			defaultVariants: {
        size: 'lg'
			}
		},
	
		alert: {
			variants: {
				orientation: {
          vertical: {
            actions: 'items-center justify-end'
          },
				}
			}
		},
		carousel: {
      slots: {
				dots: '-bottom-6 gap-',
				dot: 'size-2'
			}
		},
    stepper: {
			slots:{
				trigger: 'group-data-[state=active]:text-primary'
			},
			variants: {
				color: {
					neutral:{
						trigger: 'group-data-[state=active]:bg-elevated group-data-[state=active]:outline-2 group-data-[state=active]:outline-offset-2 group-data-[state=active]:outline-bg-elevated' ,
					} 
				}
			}
		},
		card: {
			variants: {
				variant: {
				soft: {
					root: 'bg-accented'
				},
			}
			}
		},
		avatar: {
			 slots: {
        root:'bg-accented'
			}
		}
	}
})