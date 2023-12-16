// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.20;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

// IMPORTANT: THIS WORKS ONLY ON GOERLI

contract Swap {
    address private constant routerAddress =
        0xE592427A0AEce92De3Edee1F18E0157C05861564;

    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    uint24 public constant poolFee = 10000;

    constructor() {}

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amount
    ) external returns (uint256 amountOut) {
        uint256 allowance = IERC20(tokenIn).allowance(
            msg.sender,
            address(this)
        );

        require(allowance >= amount, "Not enough allowance");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);

        IERC20(tokenIn).approve(address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);

        return amountOut;
    }
}
