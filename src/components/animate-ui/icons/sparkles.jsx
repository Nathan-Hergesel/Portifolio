'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { getVariants, useAnimateIconContext, IconWrapper } from '@/src/components/animate-ui/icons/icon';

const animations = {
  default: {
    path1: {
      initial: {
        scale: 1,
        rotate: 0,
      },
      animate: {
        scale: [1, 0.88, 1.08, 1],
        rotate: [0, -8, 8, 0],
        transformOrigin: 'center',
        transition: {
          duration: 1,
          ease: 'easeInOut',
        },
      },
    },

    path2: {
      initial: {
        opacity: 1,
        scale: 1,
      },
      animate: {
        opacity: [1, 0.25, 1],
        scale: [1, 0.6, 1],
        transformOrigin: 'center',
        transition: {
          duration: 1,
          delay: 0.12,
          ease: 'easeInOut',
        },
      },
    },

    path3: {
      initial: {
        opacity: 1,
        scale: 1,
      },
      animate: {
        opacity: [1, 0.25, 1],
        scale: [1, 0.6, 1],
        transformOrigin: 'center',
        transition: {
          duration: 1,
          delay: 0.24,
          ease: 'easeInOut',
        },
      },
    }
  }
};

function IconComponent({
  size,
  ...props
}) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <motion.path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
        variants={variants.path1}
        initial="initial"
        animate={controls} />
      <motion.path
        d="M20 3v4"
        variants={variants.path2}
        initial="initial"
        animate={controls} />
      <motion.path
        d="M22 5h-4"
        variants={variants.path3}
        initial="initial"
        animate={controls} />
    </motion.svg>
  );
}

function Sparkles(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { animations, Sparkles, Sparkles as SparklesIcon };
