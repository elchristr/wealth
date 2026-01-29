
import React from 'react';
import { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const formatNum = (val: number) => 
    val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
          <img src={asset.icon} alt={asset.name} className="w-6 h-6 object-contain grayscale-[0.2]" />
        </div>
        <div>
          <h3 className="text-[#0B0B23] font-bold text-[14px] leading-tight">{asset.name}</h3>
          <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
            {asset.secondarySymbol === '$' ? '$' : ''}{formatNum(asset.amount)} {asset.secondarySymbol !== '$' ? asset.secondarySymbol : ''}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-[#0B0B23] font-bold text-[14px]">
          ${formatNum(asset.valueFiat)}
        </p>
        <div className="flex items-center justify-end mt-0.5">
          <span className="text-green-500 text-[10px] font-bold">
            +{asset.apy.toFixed(1)}% APY
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
