"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  /**
   * When true, the default indicator dot will not be rendered and base styles are omitted.
   * Useful for custom-styled radio items such as glass toggles.
   */
  unstyled?: boolean;
  /**
   * Set to false to omit the default indicator entirely, or provide a custom indicator node.
   */
  indicator?: React.ReactNode | false;
};

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, unstyled = false, indicator, ...props }, ref) => {
  const mergedClassName = cn(
    unstyled
      ? null
      : "aspect-square size-4 rounded-full border border-input shadow-sm shadow-black/5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    className,
  );

  const renderIndicator = indicator ?? true;

  return (
    <RadioGroupPrimitive.Item ref={ref} className={mergedClassName} {...props}>
      {children}
      {renderIndicator && (
        React.isValidElement(renderIndicator) ? (
          renderIndicator
        ) : (
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="currentcolor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3" cy="3" r="3" />
            </svg>
          </RadioGroupPrimitive.Indicator>
        )
      )}
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
