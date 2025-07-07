import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillingInfo {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingInformationProps {
  billingInfo: BillingInfo;
  sameAsBilling: boolean;
  onBillingInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSameAsBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BillingInformation: React.FC<BillingInformationProps> = ({
  billingInfo,
  sameAsBilling,
  onBillingInfoChange,
  onSameAsBillingChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={billingInfo.name}
            onChange={onBillingInfoChange}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={billingInfo.email}
            onChange={onBillingInfoChange}
            readOnly // 👈 Prevents editing
            className="bg-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={billingInfo.phone}
            onChange={onBillingInfoChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address1">Address 1</Label>
        <Input
          id="address1"
          name="address1"
          value={billingInfo.address1}
          onChange={onBillingInfoChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="address2">Address 2 (Optional)</Label>
        <Input
          id="address2"
          name="address2"
          value={billingInfo.address2}
          onChange={onBillingInfoChange}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={billingInfo.city}
            onChange={onBillingInfoChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={billingInfo.state}
            onChange={onBillingInfoChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={billingInfo.zipCode}
            onChange={onBillingInfoChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={billingInfo.country}
          onChange={onBillingInfoChange}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="sameAsBilling"
          checked={sameAsBilling}
          onChange={onSameAsBillingChange}
          className="h-4 w-4"
        />
        <Label htmlFor="sameAsBilling" className="text-sm cursor-pointer">
          Shipping address same as billing
        </Label>
      </div>
    </div>
  );
};

export default BillingInformation;
