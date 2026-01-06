'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  Settings,
  FileText,
  CheckCircle,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useCreationFee, useCreatePool } from '@/hooks/useFactory';
import { useTokenInfo, useTokenBalance } from '@/hooks/useTokenInfo';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { formatTokenAmount, parseTokenAmount, formatEther, getExplorerTxUrl } from '@/lib/utils';
import { FACTORY_ADDRESS } from '@/lib/contracts';
import { Address } from 'viem';

interface PoolFormData {
  tokenAddress: string;
  rewardAmount: string;
  website: string;
  telegram: string;
  twitter: string;
  description: string;
  logoUrl: string;
}

const initialFormData: PoolFormData = {
  tokenAddress: '',
  rewardAmount: '',
  website: '',
  telegram: '',
  twitter: '',
  description: '',
  logoUrl: '',
};

const steps = [
  { id: 1, title: 'Token', icon: Coins },
  { id: 2, title: 'Rewards', icon: Settings },
  { id: 3, title: 'Details', icon: FileText },
  { id: 4, title: 'Review', icon: CheckCircle },
];

export function CreatePoolForm() {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PoolFormData>(initialFormData);
  const [isComplete, setIsComplete] = useState(false);

  // Get creation fee
  const { data: creationFee } = useCreationFee();

  // Token info
  const validTokenAddress = isAddress(formData.tokenAddress) ? formData.tokenAddress as Address : undefined;
  const { data: tokenInfo, isLoading: isLoadingToken, error: tokenInfoError } = useTokenInfo(validTokenAddress);

  // Check if valid address but failed to load token info (not a valid ERC20)
  const isInvalidERC20 = validTokenAddress && !isLoadingToken && !tokenInfo && formData.tokenAddress.length > 0;

  // User's token balance
  const { data: tokenBalance } = useTokenBalance(validTokenAddress, address);

  // Parse reward amount
  const parsedRewardAmount = tokenInfo
    ? parseTokenAmount(formData.rewardAmount, tokenInfo.decimals)
    : 0n;

  // Create pool hook
  const {
    createPool,
    hash: createPoolHash,
    isPending: isCreatingPool,
    isConfirming: isConfirmingPool,
    isSuccess: createPoolSuccess,
    error: createPoolError,
  } = useCreatePool();

  // Token approval for factory (must approve before creating pool)
  const {
    isApproved,
    approve,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: approvalSuccess,
    error: approvalError,
    refetchAllowance,
  } = useTokenApproval({
    tokenAddress: validTokenAddress,
    spenderAddress: FACTORY_ADDRESS,
    ownerAddress: address,
    amount: parsedRewardAmount,
  });

  // Handle pool creation success
  useEffect(() => {
    if (createPoolSuccess && createPoolHash) {
      toast.success('Pool created successfully!', {
        description: 'Your staking pool is now live!',
        action: {
          label: 'View TX',
          onClick: () => window.open(getExplorerTxUrl(createPoolHash), '_blank'),
        },
      });
      setIsComplete(true);
    }
  }, [createPoolSuccess, createPoolHash]);

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess) {
      toast.success('Approval successful!', {
        description: 'You can now create the pool.',
      });
      refetchAllowance();
    }
  }, [approvalSuccess, refetchAllowance]);

  // Handle errors
  useEffect(() => {
    if (createPoolError) {
      let message = 'Failed to create pool';
      let description = 'Please try again.';

      if (createPoolError.message.includes('User rejected') || createPoolError.message.includes('rejected')) {
        message = 'Transaction rejected';
        description = 'You rejected the transaction in your wallet.';
      } else if (createPoolError.message.includes('insufficient funds')) {
        message = 'Insufficient funds';
        description = 'You don\'t have enough QIE to pay the creation fee.';
      } else if (createPoolError.message.includes('execution reverted')) {
        message = 'Transaction failed';
        description = 'The transaction was reverted by the contract.';
      }

      toast.error(message, { description });
    }
  }, [createPoolError]);

  // Handle approval errors
  useEffect(() => {
    if (approvalError) {
      let message = 'Approval failed';
      let description = 'Please try again.';

      if (approvalError.message.includes('User rejected') || approvalError.message.includes('rejected')) {
        message = 'Approval rejected';
        description = 'You rejected the approval in your wallet.';
      }

      toast.error(message, { description });
    }
  }, [approvalError]);

  const updateFormData = useCallback((field: keyof PoolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const canProceedStep1 = isAddress(formData.tokenAddress) && tokenInfo && !isLoadingToken && !isInvalidERC20;
  const canProceedStep2 = parsedRewardAmount > 0n && tokenBalance && parsedRewardAmount <= tokenBalance;
  const canProceedStep3 = formData.description.length > 0;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreatePool = () => {
    if (!creationFee || !validTokenAddress) return;

    createPool({
      stakingToken: validTokenAddress,
      rewardAmount: parsedRewardAmount,
      website: formData.website,
      telegram: formData.telegram,
      twitter: formData.twitter,
      description: formData.description,
      logoUrl: formData.logoUrl,
      creationFee: creationFee as bigint,
    });
  };

  const handleApprove = () => {
    approve();
  };

  if (!isConnected) {
    return (
      <Card className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-tertiary flex items-center justify-center">
          <Coins className="w-10 h-10 text-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Connect your wallet to create a staking pool for your token.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Pool Created Successfully!
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Your staking pool is now live and ready for users to stake their {tokenInfo?.symbol} tokens.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => window.location.href = '/pools'}>
            View All Pools
          </Button>
          <Button onClick={() => {
            setFormData(initialFormData);
            setCurrentStep(1);
            setIsComplete(false);
          }}>
            Create Another Pool
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                    ${isActive ? 'bg-primary text-white' : ''}
                    ${isCompleted ? 'bg-success/20 text-success' : ''}
                    ${!isActive && !isCompleted ? 'bg-background-tertiary text-text-secondary' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium hidden md:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Steps */}
      <Card className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Token Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Select Token</h2>
                <p className="text-text-secondary">
                  Enter the address of the ERC-20 token you want to create a staking pool for.
                </p>
              </div>

              <Input
                label="Token Contract Address"
                placeholder="0x..."
                value={formData.tokenAddress}
                onChange={(e) => updateFormData('tokenAddress', e.target.value)}
                hint="Enter the contract address of your ERC-20 token"
                error={
                  formData.tokenAddress && !isAddress(formData.tokenAddress)
                    ? 'Invalid address format'
                    : isInvalidERC20
                    ? 'Not a valid ERC-20 token contract'
                    : ''
                }
              />

              {/* Token Info Display */}
              {isLoadingToken && validTokenAddress && (
                <div className="p-4 bg-background-tertiary rounded-xl animate-pulse">
                  <div className="h-5 bg-background-secondary rounded w-1/3 mb-2" />
                  <div className="h-4 bg-background-secondary rounded w-1/4" />
                </div>
              )}

              {/* Invalid ERC20 Error Display */}
              {isInvalidERC20 && (
                <div className="p-4 bg-error/10 rounded-xl border border-error/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-error mb-1">Invalid Token Contract</p>
                      <p className="text-sm text-text-secondary">
                        The address you entered is not a valid ERC-20 token contract. Please check the address and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tokenInfo && (
                <div className="p-4 bg-background-tertiary rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Token Name</span>
                    <span className="font-medium text-white">{tokenInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Symbol</span>
                    <Badge>{tokenInfo.symbol}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Decimals</span>
                    <span className="font-medium text-white">{tokenInfo.decimals}</span>
                  </div>
                  {tokenBalance !== undefined && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-text-secondary">Your Balance</span>
                      <span className="font-medium text-text-accent">
                        {formatTokenAmount(tokenBalance, tokenInfo.decimals)} {tokenInfo.symbol}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Reward Amount */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Set Reward Amount</h2>
                <p className="text-text-secondary">
                  Specify the total amount of {tokenInfo?.symbol || 'tokens'} to distribute as rewards over 12 months.
                </p>
              </div>

              <Input
                label={`Reward Amount (${tokenInfo?.symbol || 'Tokens'})`}
                type="number"
                placeholder="0.0"
                value={formData.rewardAmount}
                onChange={(e) => updateFormData('rewardAmount', e.target.value)}
                hint={`Your balance: ${tokenBalance ? formatTokenAmount(tokenBalance, tokenInfo?.decimals || 18) : '0'} ${tokenInfo?.symbol || ''}`}
                error={tokenBalance && parsedRewardAmount > tokenBalance ? 'Insufficient balance' : ''}
              />

              {/* Pool Duration Info */}
              <div className="p-4 bg-primary-light rounded-xl border border-border-accent">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Pool Duration: 12 Months</p>
                    <p className="text-sm text-text-secondary">
                      Rewards will be distributed linearly over 365 days. Users can stake and unstake at any time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reward Preview */}
              {parsedRewardAmount > 0n && tokenInfo && (
                <div className="p-4 bg-background-tertiary rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Daily Rewards</span>
                    <span className="font-medium text-white">
                      ~{formatTokenAmount(parsedRewardAmount / 365n, tokenInfo.decimals)} {tokenInfo.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Monthly Rewards</span>
                    <span className="font-medium text-white">
                      ~{formatTokenAmount(parsedRewardAmount / 12n, tokenInfo.decimals)} {tokenInfo.symbol}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Pool Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Pool Details</h2>
                <p className="text-text-secondary">
                  Add information to help users learn about your project.
                </p>
              </div>

              <Input
                label="Description"
                placeholder="Describe your token and staking pool..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                hint="Required - Tell users about your project"
              />

              <Input
                label="Logo URL"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => updateFormData('logoUrl', e.target.value)}
                hint="Optional - URL to your token's logo image"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Website"
                  placeholder="https://"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  hint="Optional"
                />
                <Input
                  label="Telegram"
                  placeholder="@username or t.me/..."
                  value={formData.telegram}
                  onChange={(e) => updateFormData('telegram', e.target.value)}
                  hint="Optional"
                />
                <Input
                  label="Twitter"
                  placeholder="@username"
                  value={formData.twitter}
                  onChange={(e) => updateFormData('twitter', e.target.value)}
                  hint="Optional"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Review & Create</h2>
                <p className="text-text-secondary">
                  Review your pool configuration before creating.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-background-tertiary rounded-xl space-y-4">
                <h3 className="font-semibold text-white">Pool Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Token</span>
                    <span className="font-medium text-white">{tokenInfo?.name} ({tokenInfo?.symbol})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Reward Amount</span>
                    <span className="font-medium text-text-accent">
                      {tokenInfo && formatTokenAmount(parsedRewardAmount, tokenInfo.decimals)} {tokenInfo?.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-medium text-white">12 Months</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Description</span>
                    <span className="font-medium text-white text-right max-w-[200px] truncate">
                      {formData.description}
                    </span>
                  </div>
                </div>

                {/* Creation Fee */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Creation Fee</span>
                    <span className="font-semibold text-white">
                      {creationFee ? formatEther(creationFee as bigint) : '0'} QIE
                    </span>
                  </div>
                </div>
              </div>

              {/* Creation Steps */}
              <div className="p-4 bg-primary-light rounded-xl border border-border-accent">
                <h4 className="font-medium text-white mb-3">Creation Process</h4>
                <ol className="space-y-2 text-sm text-text-secondary">
                  <li className={`flex items-start gap-2 ${isApproved ? 'text-success' : ''}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${isApproved ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {isApproved ? <Check className="w-3 h-3" /> : '1'}
                    </span>
                    <span>Approve tokens for the factory contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Create pool (pay creation fee in QIE)</span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              {!isApproved ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleApprove}
                  isLoading={isApproving || isApprovingConfirming}
                  disabled={parsedRewardAmount === 0n}
                >
                  {isApproving ? 'Confirming...' : isApprovingConfirming ? 'Approving...' : `Approve ${tokenInfo?.symbol || 'Tokens'}`}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreatePool}
                  isLoading={isCreatingPool || isConfirmingPool}
                  disabled={!creationFee}
                >
                  {isCreatingPool ? 'Confirming...' : isConfirmingPool ? 'Creating Pool...' : 'Create Pool'}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3)
              }
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isApproving || isApprovingConfirming || isCreatingPool || isConfirmingPool}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
